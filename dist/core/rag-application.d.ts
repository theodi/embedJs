import { BaseLoader } from '../interfaces/base-loader.js';
import { AddLoaderReturn, Chunk } from '../global/types.js';
import { RAGApplicationBuilder } from './rag-application-builder.js';
export declare class RAGApplication {
    private readonly debug;
    private readonly initLoaders;
    private readonly queryTemplate;
    private readonly searchResultCount;
    private readonly loaders;
    private readonly cache?;
    private readonly vectorDb;
    private readonly model;
    constructor(llmBuilder: RAGApplicationBuilder);
    private embedChunks;
    private getChunkUniqueId;
    init(): Promise<void>;
    private batchLoadEmbeddings;
    private batchLoadChunks;
    private incrementalLoader;
    addLoader(loader: BaseLoader): Promise<AddLoaderReturn>;
    getEmbeddingsCount(): Promise<number>;
    deleteEmbeddingsFromLoader(uniqueLoaderId: string, areYouSure?: boolean): Promise<boolean>;
    deleteAllEmbeddings(areYouSure?: boolean): Promise<boolean>;
    getEmbeddings(cleanQuery: string): Promise<Chunk[]>;
    getContext(query: string): Promise<Chunk[]>;
    query(userQuery: string, conversationId?: string): Promise<{
        result: string;
        cost: number;
        sources: string[];
    }>;
}
