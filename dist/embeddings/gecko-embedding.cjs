"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeckoEmbedding = void 0;
const googlevertexai_1 = require("@langchain/community/embeddings/googlevertexai");
class GeckoEmbedding {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new googlevertexai_1.GoogleVertexAIEmbeddings({ model: 'textembedding-gecko', maxConcurrency: 3, maxRetries: 5 });
    }
    getDimensions() {
        return 768;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
exports.GeckoEmbedding = GeckoEmbedding;
