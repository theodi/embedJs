import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class MongoDBAtlas implements BaseDb {
    private readonly debug;
    private readonly client;
    private readonly db;
    private readonly collectionName;
    constructor({ uri, // MongoDB URI
    dbName, // Database name
    collectionName }: {
        uri: any;
        dbName: any;
        collectionName: any;
    });
    init(): Promise<void>;
    insertChunks(chunks: EmbeddedChunk[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<Chunk[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
