import { BaseLoader } from '../interfaces/base-loader.js';
export declare class YoutubeSearchLoader extends BaseLoader<{
    type: 'YoutubeSearchLoader';
}> {
    private readonly debug;
    private readonly searchString;
    constructor({ youtubeSearchString, chunkSize, chunkOverlap, }: {
        youtubeSearchString: string;
        chunkSize?: number;
        chunkOverlap?: number;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        metadata: {
            type: "YoutubeSearchLoader";
            originalSource: string;
            source: string;
        };
        pageContent: string;
    }, void, unknown>;
}
