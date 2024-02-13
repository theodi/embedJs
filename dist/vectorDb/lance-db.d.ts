import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class LanceDb implements BaseDb {
    private static readonly STATIC_DB_NAME;
    private readonly isTemp;
    private readonly path;
    private table;
    constructor({ path, isTemp }: {
        path: string;
        isTemp?: boolean;
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
