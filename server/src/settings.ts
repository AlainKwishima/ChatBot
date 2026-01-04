import { generateCompletion, generateEmbedding } from './embeddings';
import { searchVectorStore } from './vectorStore';
import { findFAQAnswer } from './faq';

export async function generateAnswer(question: string, history: any[]): Promise<string> {
    // 1. Check for greetings (Only if the message is short/isolated)
    if (question.length < 30 && question.match(/^(hi|hello|hey|greetings)/i)) {
        return "Hello! I am the Empirical Tours chatbot. How can I assist you today?";
    }

    // 2. Check FAQ for instant accurate answers
    const faqAnswer = findFAQAnswer(question);
    if (faqAnswer) {
        return faqAnswer;
    }

    // 3. Generate embedding for the question
    const embedding = await generateEmbedding(question);

    // 4. Search for relevant context
    const results = await searchVectorStore(embedding, 3);

    // 5. Construct Context
    const context = results.map(r => `[Source: ${r.title} (${r.url})]\n${r.text}`).join("\n\n");

    // 6. Ask LLM
    if (!context) {
        return "I couldn't find any relevant information on the website to answer your question.";
    }

    const answer = await generateCompletion(question, context);
    return answer;
}
