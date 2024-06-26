import { BaseDb } from '../interfaces/base-db.js';
import { RAGApplication } from './rag-application.js';
import { BaseCache } from '../interfaces/base-cache.js';
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
import { BaseModel } from '../interfaces/base-model.js';
import { SIMPLE_MODELS } from '../global/constants.js';
import { LoaderParam } from './dynamic-loader-selector.js';
import { BaseConversations } from '../interfaces/base-conversations.js';
export declare class RAGApplicationBuilder {
    private temperature;
    private queryTemplate;
    private cache?;
    private model;
    private searchResultCount;
    private embeddingModel;
    private embeddingRelevanceCutOff;
    private loaders;
    private vectorDb;
    private conversations;
    constructor();
    build(): Promise<RAGApplication>;
    addLoader(loader: LoaderParam): this;
    setSearchResultCount(searchResultCount: number): this;
    setVectorDb(vectorDb: BaseDb): this;
    setTemperature(temperature: number): this;
    setEmbeddingRelevanceCutOff(embeddingRelevanceCutOff: number): this;
    setQueryTemplate(queryTemplate: string): this;
    setCache(cache: BaseCache): this;
    setEmbeddingModel(embeddingModel: BaseEmbeddings): this;
    setModel(model: 'NO_MODEL' | SIMPLE_MODELS | BaseModel): this;
    getLoaders(): LoaderParam[];
    getSearchResultCount(): number;
    getVectorDb(): BaseDb;
    getTemperature(): number;
    getEmbeddingRelevanceCutOff(): number;
    getQueryTemplate(): string;
    getCache(): BaseCache;
    getEmbeddingModel(): BaseEmbeddings;
    getModel(): BaseModel;
    setConversations(conversations: BaseConversations): this;
    getConversations(): BaseConversations;
}
