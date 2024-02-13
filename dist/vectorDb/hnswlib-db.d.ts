import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class HNSWDb implements BaseDb {
    private readonly debug;
    private index;
    private docCount;
    private docMap;
    constructor();
    init({ dimensions }: {
        dimensions: number;
    }): Promise<void>;
    insertChunks(chunks: EmbeddedChunk[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<Chunk[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(_uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
