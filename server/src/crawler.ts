import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import robotsParser from 'robots-parser';
import { addToVectorStore } from './vectorStore';
import { generateEmbedding } from './embeddings';

const visited = new Set<string>();

async function getRobotsTxt(baseUrl: string) {
    try {
        const robotsUrl = new URL('/robots.txt', baseUrl).toString();
        const response = await axios.get(robotsUrl);
        return robotsParser(robotsUrl, response.data);
    } catch (e) {
        console.warn(`Could not fetch robots.txt for ${baseUrl}, assuming allow all.`);
        return null;
    }
}

export async function crawlWebsite(startUrl: string = 'https://empiricaltour.com/'): Promise<number> {
    visited.clear();
    const queue = [startUrl];
    let indexedCount = 0;
    const MAX_PAGES = 100;

    const robots = await getRobotsTxt(startUrl);
    const domain = new URL(startUrl).hostname;

    console.log(`Starting crawl for ${startUrl} (Max: ${MAX_PAGES})...`);

    while (queue.length > 0 && visited.size < MAX_PAGES) {
        const currentUrl = queue.shift()!;

        if (visited.has(currentUrl)) continue;
        visited.add(currentUrl);

        // Check Robots.txt
        if (robots && !robots.isAllowed(currentUrl, 'ChatBotBot')) {
            console.log(`Blocked by robots.txt: ${currentUrl}`);
            continue;
        }

        try {
            // Add User-Agent to avoid blocking
            const response = await axios.get(currentUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            const html = response.data;
            const $ = cheerio.load(html);

            // Aggressive Noise Removal - BUT keep footer as it likely contains address/contact info
            $('script, style, nav, iframe, noscript, [role="navigation"], .ad-container, .sidebar, .menu, #header').remove();

            // Explicitly target known spam/noise but keep potential address containers
            $('.copyright, .cookie-notice, .newsletter-popup').remove();

            const title = $('title').text().trim();
            console.log(`Visited: ${title} (${currentUrl})`);

            // Extract main content
            const mainContent = $('main, article, #content, .content, .post-content').length > 0
                ? $('main, article, #content, .content, .post-content').text()
                : $('body').text();

            const cleanText = mainContent.replace(/\s+/g, ' ').trim();

            // Word-based Chunking (300-800 words)
            if (cleanText.split(/\s+/).length > 50) {
                const chunks = chunkTextByWords(cleanText, 300, 800);
                console.log(`Indexing ${chunks.length} chunks from ${currentUrl}...`);

                for (const chunk of chunks) {
                    const embedding = await generateEmbedding(chunk);
                    await addToVectorStore({
                        id: `${currentUrl}-${Date.now()}-${Math.random()}`,
                        url: currentUrl,
                        title,
                        text: chunk,
                        vector: embedding
                    });
                    indexedCount++;
                }
            } else {
                console.log(`Skipping content (too short): ${cleanText.length} chars`);
            }

            // Find links
            let linksFound = 0;
            $('a').each((_, element) => {
                const href = $(element).attr('href');
                if (href) {
                    try {
                        const absoluteUrl = new URL(href, currentUrl).toString();
                        if (new URL(absoluteUrl).hostname === domain
                            && !absoluteUrl.includes('#')
                            && !visited.has(absoluteUrl)
                            && !queue.includes(absoluteUrl)) {
                            queue.push(absoluteUrl);
                            linksFound++;
                        }
                    } catch (e) { /* ignore */ }
                }
            });
            console.log(`Found ${linksFound} new internal links.`);

        } catch (error: any) {
            console.error(`Failed to fetch ${currentUrl}: ${error.message}`);
        }
    }

    return indexedCount;
}

function chunkTextByWords(text: string, minWords: number, maxWords: number): string[] {
    const chunks: string[] = [];
    const sentences = text.match(/[^.!?]+[.!?]+|\s+/g) || [text];

    let currentChunk: string[] = [];
    let currentWordCount = 0;

    for (const sentence of sentences) {
        const sentenceWordCount = sentence.trim().split(/\s+/).length;

        // If adding this sentence exceeds max words, push current chunk
        if (currentWordCount + sentenceWordCount > maxWords) {
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.join("").trim());
                // Start new chunk with overlap - keeping last sentence for context
                const lastSentence = currentChunk[currentChunk.length - 1];
                currentChunk = [lastSentence, sentence];
                currentWordCount = lastSentence.split(/\s+/).length + sentenceWordCount;
            } else {
                // Sentence itself is huge? Just push it.
                chunks.push(sentence.trim());
                currentChunk = [];
                currentWordCount = 0;
            }
        } else {
            currentChunk.push(sentence);
            currentWordCount += sentenceWordCount;
        }
    }

    // Push final chunk if it has meaningful content
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join("").trim());
    }

    return chunks;
}
