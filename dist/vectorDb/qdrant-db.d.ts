import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class QdrantDb implements BaseDb {
    private readonly debug;
    private static readonly QDRANT_INSERT_CHUNK_SIZE;
    private readonly client;
    private readonly clusterName;
    constructor({ apiKey, url, clusterName }: {
        apiKey: string;
        url: string;
        clusterName: string;
    });
    init({ dimensions }: {
        dimensions: number;
    }): Promise<void>;
    insertChunks(chunks: EmbeddedChunk[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<Chunk[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
