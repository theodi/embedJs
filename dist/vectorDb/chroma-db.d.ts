import { BaseDb } from '../interfaces/base-db.js';
import { ExtractChunkData, InsertChunkData } from '../global/types.js';
export declare class ChromaDb implements BaseDb {
    private static readonly STATIC_COLLECTION_NAME;
    private readonly url;
    private collection;
    constructor({ url }: {
        url: string;
    });
    init(): Promise<void>;
    insertChunks(chunks: InsertChunkData[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<ExtractChunkData[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
