"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PineconeDb = void 0;
const pinecone_1 = require("@pinecone-database/pinecone");
const debug_1 = __importDefault(require("debug"));
class PineconeDb {
    constructor({ projectName, namespace, indexSpec, }) {
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:vector:PineconeDb')
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "projectName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "indexSpec", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = new pinecone_1.Pinecone();
        this.projectName = projectName;
        this.namespace = namespace;
        this.indexSpec = indexSpec;
    }
    async init({ dimensions }) {
        const list = (await this.client.listIndexes()).indexes.map((i) => i.name);
        if (list.indexOf(this.projectName) > -1)
            return;
        await this.client.createIndex({
            name: this.projectName,
            dimension: dimensions,
            spec: this.indexSpec,
            metric: 'cosine',
        });
    }
    async insertChunks(chunks) {
        let processed = 0;
        const index = this.client.Index(this.projectName).namespace(this.namespace);
        for (let i = 0; i < chunks.length; i += PineconeDb.PINECONE_INSERT_CHUNK_SIZE) {
            const chunkBatch = chunks.slice(i, i + PineconeDb.PINECONE_INSERT_CHUNK_SIZE);
            const upsertCommand = chunkBatch.map((chunk) => {
                return {
                    id: chunk.metadata.id,
                    values: chunk.vector,
                    metadata: { pageContent: chunk.pageContent, ...chunk.metadata },
                };
            });
            this.debug(`Inserting Pinecone batch`);
            await index.upsert(upsertCommand);
            processed += chunkBatch.length;
        }
        return processed;
    }
    async similaritySearch(query, k) {
        const index = this.client.Index(this.projectName).namespace(this.namespace);
        const queryResponse = await index.query({
            topK: k,
            vector: query,
            includeMetadata: true,
            includeValues: true,
        });
        return queryResponse.matches.map((match) => {
            const pageContent = match.metadata.pageContent;
            delete match.metadata.pageContent;
            return {
                score: match.score,
                pageContent,
                metadata: match.metadata,
            };
        });
    }
    async getVectorCount() {
        const index = this.client.Index(this.projectName).namespace(this.namespace);
        return (await index.describeIndexStats()).totalRecordCount;
    }
    async deleteKeys(uniqueLoaderId) {
        const index = await this.client.Index(this.projectName).namespace(this.namespace);
        try {
            await index.deleteMany({ uniqueLoaderId: { $eq: uniqueLoaderId } });
            return true;
        }
        catch (e) {
            this.debug(`Failed to delete keys for loader '${uniqueLoaderId}'. 
Pinecone does not allow deleting by metadata filtering in serverless and free (what they call starter) instances`);
            return false;
        }
    }
    async reset() {
        await this.client.Index(this.projectName).namespace(this.namespace).deleteAll();
    }
}
exports.PineconeDb = PineconeDb;
Object.defineProperty(PineconeDb, "PINECONE_INSERT_CHUNK_SIZE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 200
}); //Pinecone only allows inserting 2MB worth of chunks at a time; this is an approximation
