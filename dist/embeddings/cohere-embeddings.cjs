"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohereEmbeddings = void 0;
const cohere_1 = require("@langchain/cohere");
class CohereEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new cohere_1.CohereEmbeddings({
            model: 'embed-english-v2.0',
            maxConcurrency: 3,
            maxRetries: 5,
        });
    }
    getDimensions() {
        return 4096;
    }
    embedDocuments(texts) {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text) {
        return this.model.embedQuery(text);
    }
}
exports.CohereEmbeddings = CohereEmbeddings;
