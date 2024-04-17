import { MongoClient } from 'mongodb';
import createDebugMessages from 'debug';

import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';

export class MongoDBAtlas implements BaseDb {
    private readonly debug = createDebugMessages('embedjs:vector:MongoDBAtlas');
    private readonly client: MongoClient;
    private readonly db: string;
    private readonly collectionName: string;

    constructor({
        uri, // MongoDB URI
        dbName, // Database name
        collectionName // Collection name
    }) {
        this.client = new MongoClient(uri);
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
        } catch (err) {
            console.error('Error creating Atlas Search index:', err.message);
            console.log('Please check the index in MongoDB Atlas via the website.');
            console.log('Index definition JSON:', JSON.stringify(index, null, 2));
        }

        // Additional initialization steps if needed
    }

    async insertChunks(chunks: EmbeddedChunk[]): Promise<number> {
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

    async similaritySearch(query: number[], k: number): Promise<Chunk[]> {
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


    async getVectorCount(): Promise<number> {
        const collection = this.client.db(this.db).collection(this.collectionName);
        return await collection.countDocuments();
    }

    async deleteKeys(uniqueLoaderId: string): Promise<boolean> {
        const collection = this.client.db(this.db).collection(this.collectionName);
        const result = await collection.deleteMany({ 'metadata.uniqueLoaderId': uniqueLoaderId });
        this.debug(`Deleted ${result.deletedCount} documents`);
        return result.deletedCount > 0;
    }

    async reset(): Promise<void> {
        const collection = this.client.db(this.db).collection(this.collectionName);
        await collection.deleteMany({});
        this.debug('Reset collection');
    }
}
