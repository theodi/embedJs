import { ConfluenceClient } from 'confluence.js';
import createDebugMessages from 'debug';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { WebLoader } from './web-loader.js';
export class ConfluenceLoader extends BaseLoader {
    constructor({ spaceNames, confluenceBaseUrl, confluenceUsername, confluenceToken, chunkSize, chunkOverlap, }) {
        super(`ConfluenceLoader_${md5(spaceNames.join(','))}`, { spaceNames }, chunkSize ?? 2000, chunkOverlap ?? 200);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:loader:ConfluenceLoader')
        });
        Object.defineProperty(this, "confluence", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "confluenceBaseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "spaceNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.spaceNames = spaceNames;
        this.confluenceBaseUrl = confluenceBaseUrl ?? process.env.CONFLUENCE_BASE_URL;
        this.confluence = new ConfluenceClient({
            host: this.confluenceBaseUrl,
            authentication: {
                basic: {
                    username: confluenceUsername ?? process.env.CONFLUENCE_USER_NAME,
                    password: confluenceToken ?? process.env.CONFLUENCE_API_TOKEN,
                },
            },
        });
    }
    async *getUnfilteredChunks() {
        for (const spaceKey of this.spaceNames) {
            try {
                const spaceContent = await this.confluence.space.getContentForSpace({ spaceKey });
                this.debug(`Confluence space (length ${spaceContent['page'].results.length}) obtained for space`, spaceKey);
                for await (const result of this.getContentChunks(spaceContent['page'].results)) {
                    yield result;
                }
            }
            catch (e) {
                this.debug('Could not get space details', spaceKey, e);
                continue;
            }
        }
    }
    async *getContentChunks(contentArray) {
        for (const { id } of contentArray) {
            const content = await this.confluence.content.getContentById({
                id: id,
                expand: ['body', 'children.page', 'body.view'],
            });
            if (!content.body.view.value)
                continue;
            const webLoader = new WebLoader({
                urlOrContent: content.body.view.value,
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap,
            });
            for await (const result of await webLoader.getUnfilteredChunks()) {
                //remove all types of empty brackets from string
                result.pageContent = result.pageContent.replace(/[\[\]\(\)\{\}]/g, '');
                yield {
                    pageContent: result.pageContent,
                    metadata: {
                        type: 'ConfluenceLoader',
                        source: `${this.confluenceBaseUrl}/wiki${content._links.webui}`,
                    },
                };
            }
            if (content.children) {
                for await (const result of this.getContentChunks(content.children.page.results)) {
                    yield result;
                }
            }
        }
    }
}
