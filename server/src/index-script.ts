import { crawlWebsite } from './crawler';

async function runIndex() {
    console.log("Starting manual index job...");
    try {
        const count = await crawlWebsite('https://empiricaltour.com/');
        console.log(`Completed! Indexed ${count} chunks.`);
    } catch (e) {
        console.error("Indexing failed:", e);
    }
}

runIndex();
