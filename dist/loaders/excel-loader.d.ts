import { BaseLoader } from '../interfaces/base-loader.js';
export declare class ExcelLoader extends BaseLoader<{
    type: 'ExcelLoader';
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
            type: "ExcelLoader";
            source: string;
        };
    }, void, unknown>;
}
