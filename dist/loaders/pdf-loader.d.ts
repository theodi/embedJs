import { BaseLoader } from '../interfaces/base-loader.js';
export declare class PdfLoader extends BaseLoader<{
    type: 'PdfLoader';
}> {
    private readonly pathOrUrl;
    private readonly isUrl;
    constructor({ url }: {
        url: string;
    });
    constructor({ filePath }: {
        filePath: string;
    });
    getChunks(): AsyncGenerator<{
        pageContent: string;
        contentHash: string;
        metadata: {
            type: "PdfLoader";
            source: string;
        };
    }, void, unknown>;
}
