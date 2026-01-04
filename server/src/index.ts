import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { crawlWebsite } from './crawler';
import { generateAnswer } from './settings'; // Placeholder for now

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.send('Chatbot Server is running');
});

// Crawl endpoint
app.post('/api/crawl', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        console.log(`Starting crawl for ${url}...`);
        const count = await crawlWebsite(url);
        res.json({ message: `Successfully crawled and indexed ${count} pages/chunks.` });
    } catch (error: any) {
        console.error('Crawl error:', error);
        res.status(500).json({ error: error.message || 'Failed to crawl website' });
    }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // Logic will go here: Embed question -> Search VectorDB -> Call LLM
        // For now, simple echo or placeholder
        const answer = await generateAnswer(message, history || []);
        res.json({ answer });
    } catch (error: any) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to generate answer' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
