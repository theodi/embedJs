import { BaseLoader } from '../interfaces/base-loader.js';
export declare class ConfluenceLoader extends BaseLoader<{
    type: 'ConfluenceLoader';
}> {
    private readonly debug;
    private readonly confluence;
    private readonly confluenceBaseUrl;
    private readonly spaceNames;
    constructor({ spaceNames, confluenceBaseUrl, confluenceUsername, confluenceToken, }: {
        spaceNames: [string, ...string[]];
        confluenceBaseUrl?: string;
        confluenceUsername?: string;
        confluenceToken?: string;
    });
    getChunks(): AsyncGenerator<any, void, unknown>;
    private getContentChunks;
}
