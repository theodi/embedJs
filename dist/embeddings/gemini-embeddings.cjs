"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiEmbeddings = void 0;
const google_genai_1 = require("@langchain/google-genai");
const generative_ai_1 = require("@google/generative-ai");
class GeminiEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new google_genai_1.GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001", // 768 dimensions
            taskType: generative_ai_1.TaskType.RETRIEVAL_DOCUMENT,
            title: "",
            maxConcurrency: 3,
            maxRetries: 5
        });
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
exports.GeminiEmbeddings = GeminiEmbeddings;
