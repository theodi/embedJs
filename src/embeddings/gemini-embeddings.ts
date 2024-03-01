import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';

export class GeminiEmbeddings implements BaseEmbeddings {
    private model: GoogleGenerativeAIEmbeddings;

    constructor() {    
        this.model = new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001", // 768 dimensions
            taskType: TaskType.RETRIEVAL_DOCUMENT,
            title: "",
            maxConcurrency: 3,
            maxRetries: 5
          });
    }

    getDimensions(): number {
        return 768;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }

    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}
