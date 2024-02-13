import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class ChromaDb implements BaseDb {
    private static readonly STATIC_COLLECTION_NAME;
    private readonly url;
    private collection;
    constructor({ url }: {
        url: string;
    });
    init(): Promise<void>;
    insertChunks(chunks: EmbeddedChunk[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<Chunk[]>;
    getVectorCount(): Promise<number>;
    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
