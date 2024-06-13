import { OpenAIEmbeddings } from '@langchain/openai';
export class OpenAi3LargeEmbeddings {
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
        this.model = new OpenAIEmbeddings({
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
