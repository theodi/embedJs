"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAi3LargeEmbeddings = void 0;
const openai_1 = require("@langchain/openai");
class OpenAi3LargeEmbeddings {
    constructor(params) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dynamicDimension", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dynamicDimension = params?.dynamicDimension ?? 3072;
        this.model = new openai_1.OpenAIEmbeddings({
            modelName: 'text-embedding-3-large',
            maxConcurrency: 3,
            maxRetries: 5,
            dimensions: this.dynamicDimension,
        });
    }
    getDimensions() {
        return this.dynamicDimension;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
exports.OpenAi3LargeEmbeddings = OpenAi3LargeEmbeddings;
