"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaEmbeddings = void 0;
const openai_1 = require("@langchain/openai");
class AdaEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new openai_1.OpenAIEmbeddings({ modelName: 'text-embedding-ada-002', maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 1536;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
exports.AdaEmbeddings = AdaEmbeddings;
