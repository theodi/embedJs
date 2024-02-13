import { BaseLoader } from '../interfaces/base-loader.js';
export declare class YoutubeChannelLoader extends BaseLoader<{
    type: 'YoutubeChannelLoader';
}> {
    private readonly debug;
    private readonly channelId;
    constructor({ channelId }: {
        channelId: string;
    });
    getChunks(): AsyncGenerator<{
        metadata: {
            type: "YoutubeChannelLoader";
            originalSource: string;
            source: string;
        };
        pageContent: string;
        contentHash: string;
    }, void, unknown>;
}
