"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBAtlas = void 0;
const mongodb_1 = require("mongodb");
const debug_1 = __importDefault(require("debug"));
class MongoDBAtlas {
    constructor({ uri, // MongoDB URI
    dbName, // Database name
    collectionName // Collection name
     }) {
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:vector:MongoDBAtlas')
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = new mongodb_1.MongoClient(uri);
        this.db = dbName;
        this.collectionName = collectionName;
    }
    async init() {
        await this.client.connect();
        this.debug('Connected to MongoDB Atlas');
        const database = this.client.db(this.db);
        const collection = database.collection(this.collectionName);
        // Define your Atlas Search index
        const index = {
            name: "VectorSearchIndex",
            definition: {
                /* search index definition fields */
                "mappings": {
                    "dynamic": true,
                    "fields": {
                        "vector": {
                            "dimensions": 1536,
                            "similarity": "euclidean",
                            "type": "knnVector"
                        }
                    }
                }
            }
        };
        // Create the Atlas Search index
        try {
            await collection.createSearchIndex(index);
        }
        catch (err) {
            console.error('Error creating Atlas Search index:', err.message);
            console.log('Please check the index in MongoDB Atlas via the website.');
            console.log('Index definition JSON:', JSON.stringify(index, null, 2));
        }
        // Additional initialization steps if needed
    }
    async insertChunks(chunks) {
        const collection = this.client.db(this.db).collection(this.collectionName);
        const insertDocuments = chunks.map(chunk => ({
            vector: chunk.vector,
            metadata: chunk.metadata,
            pageContent: chunk.pageContent
        }));
        const result = await collection.insertMany(insertDocuments);
        this.debug(`Inserted ${result.insertedCount} documents`);
        return result.insertedCount;
    }
    async similaritySearch(query, k) {
        const collection = this.client.db(this.db).collection(this.collectionName);
        const result = await collection.aggregate([
            {
                $vectorSearch: {
                    index: 'VectorSearchIndex', // Replace with your actual index name
                    path: 'vector',
                    queryVector: query,
                    numCandidates: 200,
                    limit: k
                }
            }
        ]).toArray();
        // Map the documents to Chunk type
        return result.map(doc => ({
            pageContent: doc.pageContent,
            metadata: doc.metadata
        }));
    }
    async getVectorCount() {
        const collection = this.client.db(this.db).collection(this.collectionName);
        return await collection.countDocuments();
    }
    async deleteKeys(uniqueLoaderId) {
        const collection = this.client.db(this.db).collection(this.collectionName);
        const result = await collection.deleteMany({ 'metadata.uniqueLoaderId': uniqueLoaderId });
        this.debug(`Deleted ${result.deletedCount} documents`);
        return result.deletedCount > 0;
    }
    async reset() {
        const collection = this.client.db(this.db).collection(this.collectionName);
        await collection.deleteMany({});
        this.debug('Reset collection');
    }
}
exports.MongoDBAtlas = MongoDBAtlas;
