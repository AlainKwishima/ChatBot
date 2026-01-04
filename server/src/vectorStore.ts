import * as lancedb from 'vectordb';
import path from 'path';
import fs from 'fs';

// Defines the schema/types
interface DocumentRecord {
    id: string;
    url: string;
    title: string;
    text: string;
    vector: number[];
}

let db: any = null;
let table: any = null;

const DB_DIR = path.join(process.cwd(), 'data', 'lancedb');

// Ensure data dir exists
if (!fs.existsSync(path.dirname(DB_DIR))) {
    fs.mkdirSync(path.dirname(DB_DIR), { recursive: true });
}

async function getTable() {
    if (table) return table;

    try {
        db = await lancedb.connect(DB_DIR);
        const tableName = 'documents';

        try {
            table = await db.openTable(tableName);
        } catch (e) {
            // Table doesn't exist, create it (schema is inferred from data usually, but we can specify)
            // LanceDB needs at least one record to create table or explicit schema. 
            // We'll trust the first insert or creation flow.
            // For now, let's just return null and handle creation on insert if needed.
            // Actually, vectordb `createTable` requires data.
            console.log("Table not found, initializing on first write.");
            return null;
        }
    } catch (error) {
        console.error("Error connecting to LanceDB:", error);
    }
    return table;
}

export async function addToVectorStore(record: DocumentRecord) {
    if (!db) {
        db = await lancedb.connect(DB_DIR);
    }

    let tbl = await getTable();

    if (!tbl) {
        // Create table with first record
        console.log("Creating new table 'documents'...");
        table = await db.createTable('documents', [record]);
    } else {
        await tbl.add([record]);
    }
    console.log(`Added record ${record.id} to vector store.`);
}

export async function searchVectorStore(queryVector: number[], limit = 3): Promise<DocumentRecord[]> {
    const tbl = await getTable();
    if (!tbl) return [];

    const results = await tbl.search(queryVector).limit(limit).execute();

    // Map back to our interface
    return results.map((r: any) => ({
        id: r.id as string,
        url: r.url as string,
        title: r.title as string,
        text: r.text as string,
        vector: r.vector // LanceDB returns vector usually, or we might need to select it
    }));
}
