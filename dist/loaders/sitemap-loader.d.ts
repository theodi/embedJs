import { BaseLoader } from '../interfaces/base-loader.js';
export declare class SitemapLoader extends BaseLoader<{
    type: 'SitemapLoader';
}> {
    private readonly debug;
    private readonly url;
    constructor({ url }: {
        url: string;
    });
    getChunks(): AsyncGenerator<{
        metadata: {
            type: "SitemapLoader";
            originalSource: string;
            source: string;
        };
        pageContent: string;
        contentHash: string;
    }, void, unknown>;
}
