import { BaseLoader } from '../interfaces/base-loader.js';
export declare class WebLoader extends BaseLoader<{
    type: 'WebLoader';
}> {
    private readonly debug;
    private readonly contentOrUrl;
    private readonly isUrl;
    constructor({ url }: {
        url: string;
    });
    constructor({ content }: {
        content: string;
    });
    getChunks(): AsyncGenerator<{
        pageContent: string;
        contentHash: string;
        metadata: {
            type: "WebLoader";
            source: string;
        };
    }, void, unknown>;
}
