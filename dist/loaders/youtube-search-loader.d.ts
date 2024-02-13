import { BaseLoader } from '../interfaces/base-loader.js';
export declare class YoutubeSearchLoader extends BaseLoader<{
    type: 'YoutubeSearchLoader';
}> {
    private readonly debug;
    private readonly searchString;
    constructor({ searchString }: {
        searchString: string;
    });
    getChunks(): AsyncGenerator<{
        metadata: {
            type: "YoutubeSearchLoader";
            originalSource: string;
            source: string;
        };
        pageContent: string;
        contentHash: string;
    }, void, unknown>;
}
