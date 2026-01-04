export const FAQ_KNOWLEDGE: Record<string, { keywords: string[], answer: string }> = {
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
    rwanda: {
        keywords: ['rwanda', 'kigali', 'akagera', 'thousand hills'],
        answer: "Rwanda, the 'Land of a Thousand Hills', is a stunning destination. Highlights include Akagera National Park (savannah, woodland, and wetlands with 'Big 5' potential) and the breathtaking vistas of the countryside. We offer complete tours across the country."
    },
    drc: {
        keywords: ['drc', 'congo', 'virunga', 'kahuzi-biega', 'salonga'],
        answer: "In the DR Congo, we offer treks to see Mountain Gorillas in Virunga National Park (a UNESCO World Heritage Site) and Eastern Lowland Gorillas in Kahuzi-Biega National Park. We also specialize in expeditions to Salonga National Park."
    },
    uganda: {
        keywords: ['uganda', 'pearl of africa', 'murchison', 'bwindi', 'kibale', 'queen elizabeth'],
        answer: "Uganda, known as 'The Pearl of Africa', offers incredible attractions like Murchison Falls, Bwindi Impenetrable National Park (for gorillas), Kibale (for chimpanzees), and Queen Elizabeth National Park."
    },
    burundi: {
        keywords: ['burundi', 'bujumbura', 'lake tanganyika'],
        answer: "Burundi is known for its beautiful landscapes and warm hospitality. It's a hidden gem between Tanzania, DRC, and Rwanda with a warm climate and interesting cultural sites."
    },
    gorilla_trekking: {
        keywords: ['gorilla', 'trekking', 'primate', 'monkey', 'chimpanzee'],
        answer: "We specialize in gorilla trekking in Rwanda (Volcanoes), DRC (Virunga and Kahuzi-Biega), and Uganda (Bwindi). We handle permits, logistics, and expert guiding to ensure a safe and respectful encounter with these magnificent creatures."
    },
    safety: {
        keywords: ['safe', 'security', 'danger', 'protection'],
        answer: "Security is our top priority. Rwanda is globally recognized as a safe destination. For treks, we use experienced guides and rangers. We monitor local situations closely and avoid border areas during periods of tension to ensure your absolute safety."
    },
    packing: {
        keywords: ['pack', 'bring', 'clothes', 'boots', 'gear'],
        answer: "For trekking, bring: durable hiking boots, long-sleeved shirts/trousers, waterproof rain gear, garden gloves (to grip vegetation), sun protection (hat/sunscreen), and insect repellent with DEET."
    },
    visa: {
        keywords: ['visa', 'permit', 'entry', 'passport'],
        answer: "Visa requirements: Rwanda offers visas on arrival ($30-$50). An East African Tourist Visa ($100) covers Rwanda, Uganda, and Kenya. DRC visas ($100) and Burundi transit visas ($40) are separate. Passports must be valid for at least 6 months."
    },
    health: {
        keywords: ['health', 'vaccine', 'malaria', 'yellow fever', 'doctor'],
        answer: "We recommend malaria prophylaxis and vaccinations for Yellow Fever and Typhoid. Always carry proof of yellow fever vaccination as it is often required for entry."
    },
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach', 'booking', 'book'],
        answer: "You can book or contact us through empiricaltour.com/contact. Our team typically responds within 48 hours to help plan your perfect East African adventure."
    }
};

export function findFAQAnswer(question: string): string | null {
    const lowerQuestion = question.toLowerCase();

    for (const faq of Object.values(FAQ_KNOWLEDGE)) {
        if (faq.keywords.some(keyword => lowerQuestion.includes(keyword))) {
            return faq.answer;
        }
    }

    return null;
}
