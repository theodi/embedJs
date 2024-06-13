import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
export declare class OpenAi3LargeEmbeddings implements BaseEmbeddings {
    private model;
    private readonly dynamicDimension;
    constructor(params?: {
        dynamicDimension?: number;
    });
    getDimensions(): number;
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
