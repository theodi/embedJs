import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
export class GeminiEmbeddings {
    constructor() {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
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
