export const FAQ_KNOWLEDGE = {
    location: {
        keywords: ['where', 'located', 'location', 'based', 'office', 'address'],
        answer: "Empirical Tour & Travel is based in Rubavu, Rwanda, on the beautiful shores of Lake Kivu. We operate tours throughout East Africa including Rwanda, DR Congo, Burundi, Uganda, Tanzania, and Kenya."
    },
    about: {
        keywords: ['who are you', 'about', 'company', 'founded', 'story'],
        answer: "We are Empirical Tour & Travel, founded in 2018. We are expert guides to the heart of East Africa, creating unforgettable, sustainable, and responsible travel experiences. We are a passionate team of locals dedicated to showing you the rich biodiversity and vibrant cultures of our home."
    },
    services: {
        keywords: ['services', 'offer', 'do', 'tours', 'what'],
        answer: "We offer customized trips and private tours including: gorilla trekking, safaris, cultural tours, sightseeing tours, hiking adventures, tour operations, transportation, accommodations, and comprehensive travel experiences across East Africa."
    },
    destinations: {
        keywords: ['where do you operate', 'countries', 'destinations', 'travel to'],
        answer: "We operate tours in Rwanda, DR Congo (DRC), Burundi, Uganda, Tanzania, and Kenya. We specialize in East African travel experiences with a focus on sustainable and responsible tourism."
    },
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach'],
        answer: "You can contact us through our website at empiricaltour.com/contact. We'll get back to you within 48 hours."
    }
};

export function findFAQAnswer(question: string): string | null {
    const lowerQuestion = question.toLowerCase();

    for (const [key, faq] of Object.entries(FAQ_KNOWLEDGE)) {
        if (faq.keywords.some(keyword => lowerQuestion.includes(keyword))) {
            return faq.answer;
        }
    }

    return null;
}
