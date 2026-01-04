import { pipeline } from '@xenova/transformers';
import { Ollama } from 'ollama';

let extractor: any = null;
const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!text) return [];

    if (!extractor) {
        console.log("Loading local embedding model (all-MiniLM-L6-v2)...");
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    try {
        const output = await extractor(text, { pooling: 'mean', normalize: true });
        // Output is a Tensor, we need array
        return Array.from(output.data);
    } catch (error) {
        console.error("Error generating local embedding:", error);
        throw error;
    }
}

// NEW: Using Ollama for much better generation quality
export async function generateCompletion(prompt: string, context: string): Promise<string> {
    const systemPrompt = `You are a helpful assistant for Empirical Tour & Travel. Answer questions ONLY based on the provided context from the company website. If the context doesn't contain the answer, say so. Be friendly and concise.`;

    const fullPrompt = `Context from empiricaltour.com:
${context}

Question: ${prompt}

Answer based ONLY on the context above:`;

    try {
        console.log("Generating answer with Ollama (llama3.1)...");
        const response = await ollama.chat({
            model: 'llama3.1',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: fullPrompt }
            ],
            options: {
                temperature: 0.3, // Lower for more focused answers
                num_ctx: 4096 // Context window
            }
        });

        return response.message.content || "I apologize, I couldn't generate a response.";
    } catch (error: any) {
        console.error("Ollama error:", error);

        // Fallback error messages
        if (error.message?.includes('connect')) {
            return "⚠️ Ollama is not running. Please start Ollama first with 'ollama serve' in a terminal.";
        }
        if (error.message?.includes('model')) {
            return "⚠️ Model 'llama3.1' not found. Please run 'ollama pull llama3.1' to download it.";
        }

        return "Sorry, I encountered an error generating a response. Please make sure Ollama is running.";
    }
}
