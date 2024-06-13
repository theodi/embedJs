"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaviateDb = void 0;
const debug_1 = __importDefault(require("debug"));
const weaviate_ts_client_1 = __importStar(require("weaviate-ts-client"));
const compute_cosine_similarity_1 = __importDefault(require("compute-cosine-similarity"));
const strings_js_1 = require("../util/strings.cjs");
class WeaviateDb {
    constructor({ host, apiKey, className, scheme = 'https', }) {
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:vector:WeaviateDb')
        });
        Object.defineProperty(this, "dimensions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "className", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // @ts-ignore
        this.client = weaviate_ts_client_1.default.client({ scheme, host, apiKey: new weaviate_ts_client_1.ApiKey(apiKey) });
        this.className = (0, strings_js_1.toTitleCase)(className); // Weaviate translates the className during create to title case and errors at other places
    }
    async init({ dimensions }) {
        this.dimensions = dimensions;
        const { classes: list } = await this.client.schema.getter().do();
        if (list.map((l) => l.class).indexOf(this.className) > -1)
            return;
        await this.client.schema
            .classCreator()
            .withClass({
            class: this.className,
            properties: [
                {
                    name: 'realId',
                    dataType: ['text'],
                },
                {
                    name: 'pageContent',
                    dataType: ['text'],
                },
                {
                    name: 'uniqueLoaderId',
                    dataType: ['text'],
                },
                {
                    name: 'source',
                    dataType: ['text'],
                },
            ],
            vectorIndexConfig: {
                distance: 'cosine',
            },
        })
            .do();
    }
    async insertChunks(chunks) {
        let processed = 0;
        const batcher = this.client.batch.objectsBatcher();
        for (let i = 0; i < chunks.length; i += WeaviateDb.WEAVIATE_INSERT_CHUNK_SIZE) {
            const chunkBatch = chunks.slice(i, i + WeaviateDb.WEAVIATE_INSERT_CHUNK_SIZE);
            this.debug(`Inserting Weaviate batch`);
            const result = await batcher
                .withObjects(...chunkBatch.map((chunk) => {
                const chunkId = chunk.metadata.id;
                delete chunk.metadata.id;
                return {
                    class: this.className,
                    id: (0, weaviate_ts_client_1.generateUuid5)(chunkId),
                    vector: chunk.vector,
                    properties: {
                        uniqueLoaderId: chunk.metadata.uniqueLoaderId,
                        pageContent: chunk.pageContent,
                        ...chunk.metadata,
                    },
                };
            }))
                .do();
            this.debug('Weaviate errors', result.map((r) => r.result?.errors?.error?.[0].message ?? 'NONE'));
            processed += chunkBatch.length;
        }
        return processed;
    }
    async similaritySearch(query, k) {
        const queryResponse = await this.client.graphql
            .get()
            .withClassName(this.className)
            .withNearVector({ vector: query })
            .withFields('uniqueLoaderId pageContent source _additional { vector }')
            .withLimit(k)
            .do();
        return queryResponse.data.Get[this.className].map((match) => {
            const pageContent = match.pageContent;
            delete match.pageContent;
            const vector = match._additional.vector;
            delete match._additional;
            return {
                score: (0, compute_cosine_similarity_1.default)(query, vector),
                pageContent,
                metadata: match,
            };
        });
    }
    async getVectorCount() {
        const queryResponse = await this.client.graphql
            .aggregate()
            .withClassName(this.className)
            .withFields('meta { count }')
            .do();
        return queryResponse.data.Aggregate[this.className][0].meta.count;
    }
    async deleteKeys(uniqueLoaderId) {
        await this.client.batch
            .objectsBatchDeleter()
            .withClassName(this.className)
            .withWhere({
            path: ['uniqueLoaderId'],
            operator: 'ContainsAny',
            valueTextArray: [uniqueLoaderId],
        })
            .do();
        return true;
    }
    async reset() {
        await this.client.schema.classDeleter().withClassName(this.className).do();
        await this.init({ dimensions: this.dimensions });
    }
}
exports.WeaviateDb = WeaviateDb;
Object.defineProperty(WeaviateDb, "WEAVIATE_INSERT_CHUNK_SIZE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 500
});
