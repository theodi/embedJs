import { BaseLoader } from '../interfaces/base-loader.js';
export declare class WebLoader extends BaseLoader<{
    type: 'WebLoader';
}> {
    private readonly debug;
    private readonly urlOrContent;
    private readonly isUrl;
    constructor({ urlOrContent, chunkSize, chunkOverlap, }: {
        urlOrContent: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "WebLoader";
            source: string;
        };
    }, void, unknown>;
}
