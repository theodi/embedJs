import { BaseLoader } from '../interfaces/base-loader.js';
export declare class TextLoader extends BaseLoader<{
    type: 'TextLoader';
}> {
    private readonly text;
    constructor({ text }: {
        text: string;
    });
    getChunks(): AsyncGenerator<{
        pageContent: string;
        contentHash: string;
        metadata: {
            type: "TextLoader";
            source: string;
            textId: string;
        };
    }, void, unknown>;
}
