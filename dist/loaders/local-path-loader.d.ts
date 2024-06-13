import { BaseLoader } from '../interfaces/base-loader.js';
export declare class LocalPathLoader extends BaseLoader<{
    type: 'LocalPathLoader';
}> {
    private readonly debug;
    private readonly path;
    constructor({ path }: {
        path: string;
    });
    getUnfilteredChunks(): AsyncGenerator<{
        metadata: {
            type: "LocalPathLoader";
            originalPath: string;
            source: string;
        };
        pageContent: string;
    }, void, unknown>;
    private recursivelyAddPath;
}
