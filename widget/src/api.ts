import { findFAQAnswer } from './faq';

export class ChatAPI {
    constructor() { }

    async sendMessage(message: string, _history: { role: string; content: string }[]) {
        // Mock delay for realism
        await new Promise(resolve => setTimeout(resolve, 1000));

        const answer = findFAQAnswer(message);

        if (answer) {
            return { answer };
        }

        return {
            answer: "In this Demo Mode, I can only answer specific questions about our location, services, contact, and company story. Please try asking 'Where are you located?' or 'What services do you offer?'"
        };
    }
}

// Default instance
export const api = new ChatAPI();
