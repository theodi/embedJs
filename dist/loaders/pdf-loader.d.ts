import { BaseLoader } from '../interfaces/base-loader.js';
export declare class PdfLoader extends BaseLoader<{
    type: 'PdfLoader';
}> {
    private readonly filePathOrUrl;
    private readonly isUrl;
    constructor({ filePathOrUrl, chunkOverlap, chunkSize, }: {
        filePathOrUrl: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "PdfLoader";
            source: string;
        };
    }, void, unknown>;
}
