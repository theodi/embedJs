import createDebugMessages from 'debug';
import { BaseLoader } from '../interfaces/base-loader.js';
import { DEFAULT_INSERT_BATCH_SIZE } from '../global/constants.js';
import { BaseModel } from '../interfaces/base-model.js';
import { RAGEmbedding } from './rag-embedding.js';
import { cleanString } from '../util/strings.js';
import { OpenAi3SmallEmbeddings } from '../index.js';
import { InMemoryConversations } from '../conversations/memory-conversations.js';
export class RAGApplication {
    constructor(llmBuilder) {
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:core')
        });
        Object.defineProperty(this, "initLoaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queryTemplate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "searchResultCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "loaders", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "vectorDb", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "conversations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cache = llmBuilder.getCache();
        BaseLoader.setCache(this.cache);
        this.model = llmBuilder.getModel();
        BaseModel.setDefaultTemperature(llmBuilder.getTemperature());
        this.conversations = llmBuilder.getConversations() || new InMemoryConversations();
        BaseModel.setConversations(this.conversations); // Use the set conversations
        this.queryTemplate = cleanString(llmBuilder.getQueryTemplate());
        this.debug(`Using system query template - "${this.queryTemplate}"`);
        this.loaders = llmBuilder.getLoaders();
        this.vectorDb = llmBuilder.getVectorDb();
        this.searchResultCount = llmBuilder.getSearchResultCount();
        this.initLoaders = llmBuilder.getLoaderInit();
        RAGEmbedding.init(llmBuilder.getEmbeddingModel() ?? new OpenAi3SmallEmbeddings());
        if (!this.model)
            throw new SyntaxError('Model not set');
        if (!this.vectorDb)
            throw new SyntaxError('VectorDb not set');
    }
    async embedChunks(chunks) {
        const texts = chunks.map(({ pageContent }) => pageContent);
        return RAGEmbedding.getEmbedding().embedDocuments(texts);
    }
    getChunkUniqueId(loaderUniqueId, incrementId) {
        return `${loaderUniqueId}_${incrementId}`;
    }
    async init() {
        await this.model.init();
        this.debug('Initialized LLM class');
        await this.vectorDb.init({ dimensions: RAGEmbedding.getEmbedding().getDimensions() });
        this.debug('Initialized vector database');
        if (this.cache) {
            await this.cache.init();
            this.debug('Initialized cache');
        }
        if (this.initLoaders) {
            for await (const loader of this.loaders) {
                await this.addLoader(loader);
            }
        }
    }
    async batchLoadEmbeddings(loaderUniqueId, formattedChunks) {
        if (formattedChunks.length === 0)
            return 0;
        const embeddings = await this.embedChunks(formattedChunks);
        this.debug(`Batch embeddings (size ${formattedChunks.length}) obtained for loader`, loaderUniqueId);
        const embedChunks = formattedChunks.map((chunk, index) => {
            return {
                pageContent: chunk.pageContent,
                vector: embeddings[index],
                metadata: chunk.metadata,
            };
        });
        return this.vectorDb.insertChunks(embedChunks);
    }
    async batchLoadChunks(uniqueId, incrementalGenerator) {
        let i = 0, batchSize = 0, newInserts = 0, formattedChunks = [];
        for await (const chunk of incrementalGenerator) {
            batchSize++;
            const formattedChunk = {
                pageContent: chunk.pageContent,
                metadata: {
                    ...chunk.metadata,
                    uniqueLoaderId: uniqueId,
                    id: this.getChunkUniqueId(uniqueId, i++),
                },
            };
            formattedChunks.push(formattedChunk);
            if (batchSize % DEFAULT_INSERT_BATCH_SIZE === 0) {
                newInserts += await this.batchLoadEmbeddings(uniqueId, formattedChunks);
                formattedChunks = [];
                batchSize = 0;
            }
        }
        newInserts += await this.batchLoadEmbeddings(uniqueId, formattedChunks);
        return { newInserts, formattedChunks };
    }
    async incrementalLoader(uniqueId, incrementalGenerator) {
        this.debug(`incrementalChunkAvailable for loader`, uniqueId);
        const { newInserts } = await this.batchLoadChunks(uniqueId, incrementalGenerator);
        this.debug(`${newInserts} new incrementalChunks processed`, uniqueId);
    }
    async addLoader(loader) {
        const uniqueId = loader.getUniqueId();
        this.debug('Add loader called for', uniqueId);
        await loader.init();
        const chunks = await loader.getChunks();
        if (this.cache && (await this.cache.hasLoader(uniqueId))) {
            const { chunkCount: previousChunkCount } = await this.cache.getLoader(uniqueId);
            this.debug(`Loader previously run. Deleting previous ${previousChunkCount} keys`, uniqueId);
            if (previousChunkCount > 0) {
                const deleteResult = await this.vectorDb.deleteKeys(uniqueId);
                if (this.cache && deleteResult)
                    await this.cache.deleteLoader(uniqueId);
            }
        }
        const { newInserts, formattedChunks } = await this.batchLoadChunks(uniqueId, chunks);
        if (this.cache)
            await this.cache.addLoader(uniqueId, formattedChunks.length);
        this.debug(`Add loader completed with ${newInserts} new entries for`, uniqueId);
        if (loader.canIncrementallyLoad) {
            this.debug(`Registering incremental loader`, uniqueId);
            loader.on('incrementalChunkAvailable', async (incrementalGenerator) => {
                await this.incrementalLoader(uniqueId, incrementalGenerator);
            });
        }
        return { entriesAdded: newInserts, uniqueId };
    }
    async getEmbeddingsCount() {
        return this.vectorDb.getVectorCount();
    }
    async deleteEmbeddingsFromLoader(uniqueLoaderId, areYouSure = false) {
        if (!areYouSure) {
            console.warn('Delete embeddings from loader called without confirmation. No action taken.');
            return false;
        }
        // if (this.cache && !(await this.cache.hasLoader(uniqueLoaderId))) return false;
        const deleteResult = await this.vectorDb.deleteKeys(uniqueLoaderId);
        if (this.cache && deleteResult)
            await this.cache.deleteLoader(uniqueLoaderId);
        return deleteResult;
    }
    async deleteAllEmbeddings(areYouSure = false) {
        if (!areYouSure) {
            console.warn('Reset embeddings called without confirmation. No action taken.');
            return false;
        }
        await this.vectorDb.reset();
        return true;
    }
    async getEmbeddings(cleanQuery) {
        const queryEmbedded = await RAGEmbedding.getEmbedding().embedQuery(cleanQuery);
        return this.vectorDb.similaritySearch(queryEmbedded, this.searchResultCount);
    }
    async getContext(query) {
        const cleanQuery = cleanString(query);
        const rawContext = await this.getEmbeddings(cleanQuery);
        return [...new Map(rawContext.map((item) => [item.pageContent, item])).values()];
    }
    async query(userQuery, conversationId, context) {
        if (!context) {
            context = await this.getContext(userQuery);
        }
        var result = await this.model.query(this.queryTemplate, userQuery, context, conversationId);
        return result;
    }
    async clearCache() {
        await this.cache.clear();
    }
}
