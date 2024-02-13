"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAi3LargeEmbeddings = void 0;
const openai_1 = require("@langchain/openai");
class OpenAi3LargeEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new openai_1.OpenAIEmbeddings({ modelName: 'text-embedding-3-small', maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 3072;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
exports.OpenAi3LargeEmbeddings = OpenAi3LargeEmbeddings;
