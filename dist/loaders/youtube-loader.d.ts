import { BaseLoader } from '../interfaces/base-loader.js';
export declare class YoutubeLoader extends BaseLoader<{
    type: 'YoutubeLoader';
}> {
    private readonly debug;
    private readonly videoIdOrUrl;
    constructor({ videoIdOrUrl }: {
        videoIdOrUrl: string;
    });
    getChunks(): AsyncGenerator<{
        pageContent: string;
        contentHash: string;
        metadata: {
            type: "YoutubeLoader";
            source: string;
        };
    }, void, unknown>;
}
