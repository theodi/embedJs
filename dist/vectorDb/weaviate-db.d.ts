import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class WeaviateDb implements BaseDb {
    private readonly debug;
    private static readonly WEAVIATE_INSERT_CHUNK_SIZE;
    private dimensions;
    private readonly className;
    private readonly client;
    constructor({ host, apiKey, className }: {
        host: string;
        apiKey: string;
        className: string;
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
