import { BaseLoader } from '../interfaces/base-loader.js';
export declare class UrlLoader extends BaseLoader<{
    type: 'UrlLoader';
}> {
    private readonly debug;
    private readonly url;
    constructor({ url }: {
        url: string;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        pageContent: string;
        metadata: {
            type: "UrlLoader";
            source: string;
        };
    }, void, unknown>;
}
