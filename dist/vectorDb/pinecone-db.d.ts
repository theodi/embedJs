import { CreateIndexRequestSpec } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/index.js';
import { BaseDb } from '../interfaces/base-db.js';
import { Chunk, EmbeddedChunk } from '../global/types.js';
export declare class PineconeDb implements BaseDb {
    private readonly debug;
    private static readonly PINECONE_INSERT_CHUNK_SIZE;
    private readonly client;
    private readonly namespace;
    private readonly projectName;
    private readonly indexSpec;
    constructor({ projectName, namespace, indexSpec, }: {
        projectName: string;
        namespace: string;
        indexSpec: CreateIndexRequestSpec;
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
