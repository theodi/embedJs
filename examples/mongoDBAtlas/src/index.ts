import 'dotenv/config';
import { RAGApplicationBuilder, WebLoader } from '../../../src/index.js';
import { MongoDBAtlas } from '../../../src/vectorDb/mongoAtlas-db.js';
import { MongoCache } from '../../../src/cache/mongo-cache.js';

// Extract environment variables
const { MONGODB_URI, DB_NAME, COLLECTION_NAME, CACHE_COLLECTION_NAME } = process.env;

// Instantiate MongoDBAtlas with environment variables
const db = new MongoDBAtlas({
    uri: MONGODB_URI,
    dbName: DB_NAME,
    collectionName: COLLECTION_NAME
});

const cachedb = new MongoCache({
    uri: MONGODB_URI,
    dbName: DB_NAME,
    collectionName: CACHE_COLLECTION_NAME
});

// Initialize the connection to MongoDB Atlas
await db.init();

// Create an instance of RAGApplicationBuilder
const llmApplication = await new RAGApplicationBuilder()
    // Add loaders here
    //.addLoader(new WebLoader({ url: 'https://en.wikipedia.org/wiki/Tesla,_Inc.' }))
    //.addLoader(new WebLoader({ url: 'https://en.wikipedia.org/wiki/Apple_Inc.' }))
    // Set Vector Database
    .setVectorDb(db)
    .setCache(cachedb)
    .build();

// Use the application for queries
const count = await llmApplication.getEmbeddingsCount();
console.log("Documents: " + count);
console.log("");
console.log("Conversation 1 - Query 1");
console.log((await llmApplication.query('Who founded Tesla?','conversation1')));
console.log("Conversation 2 - Query 1");
console.log((await llmApplication.query('Who founded Apple?','conversation2')));
console.log("Conversation 1 - Query 2");
console.log((await llmApplication.query('and when was their biggest growth period to become a household name?','conversation1')));
console.log("Conversation 2 - Query 2");
console.log((await llmApplication.query('and when was their biggest growth period to become a household name?','conversation2')));
