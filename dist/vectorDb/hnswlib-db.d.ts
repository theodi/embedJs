import { BaseDb } from '../interfaces/base-db.js';
import { ExtractChunkData, InsertChunkData } from '../global/types.js';
export declare class HNSWDb implements BaseDb {
    private readonly debug;
    private index;
    private docCount;
    private docMap;
    init({ dimensions }: {
        dimensions: number;
    }): Promise<void>;
    insertChunks(chunks: InsertChunkData[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<ExtractChunkData[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(_uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
