import 'dotenv/config';
import { RAGApplicationBuilder, WebLoader } from '../../../src/index.js';
import { MongoDBAtlas } from '../../../src/vectorDb/mongoAtlas-db.js';

// Extract environment variables
const { MONGODB_URI, DB_NAME, COLLECTION_NAME } = process.env;

// Instantiate MongoDBAtlas with environment variables
const db = new MongoDBAtlas({
    uri: MONGODB_URI,
    dbName: DB_NAME,
    collectionName: COLLECTION_NAME
});

// Initialize the connection to MongoDB Atlas
await db.init();

// Create an instance of RAGApplicationBuilder
const llmApplication = await new RAGApplicationBuilder()
    // Add loaders here
    //.addLoader(new WebLoader({ url: 'https://en.wikipedia.org/wiki/Tesla,_Inc.' }))
    // Set Vector Database
    .setVectorDb(db)
    .build();

// Use the application for queries
const query = 'Who founded Tesla?'

const count = await llmApplication.getEmbeddingsCount();
console.log("Documents: " + count);
console.log("");
/*
console.log("Context");
const context = await llmApplication.getContext(query);
console.log(context);
console.log("");
*/
console.log("Query");
console.log((await llmApplication.query(query)));