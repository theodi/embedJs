"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfluenceLoader = void 0;
const confluence_js_1 = require("confluence.js");
const debug_1 = __importDefault(require("debug"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const web_loader_js_1 = require("./web-loader.cjs");
class ConfluenceLoader extends base_loader_js_1.BaseLoader {
    constructor({ spaceNames, confluenceBaseUrl, confluenceUsername, confluenceToken, }) {
        super(`ConfluenceLoader_${(0, md5_1.default)(spaceNames.join(','))}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:ConfluenceLoader')
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
        this.confluence = new confluence_js_1.ConfluenceClient({
            host: this.confluenceBaseUrl,
            authentication: {
                basic: {
                    username: confluenceUsername ?? process.env.CONFLUENCE_USER_NAME,
                    password: confluenceToken ?? process.env.CONFLUENCE_API_TOKEN,
                },
            },
        });
    }
    async *getChunks() {
        for (const spaceKey of this.spaceNames) {
            try {
                let i = 0;
                const spaceContent = await this.confluence.space.getContentForSpace({ spaceKey });
                this.debug(`Confluence space (length ${spaceContent['page'].results.length}) obtained for space`, spaceKey);
                for await (const result of this.getContentChunks(spaceContent['page'].results)) {
                    yield result;
                    i++;
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
            const webLoader = new web_loader_js_1.WebLoader({ content: content.body.view.value });
            for await (const result of await webLoader.getChunks()) {
                yield {
                    pageContent: result.pageContent,
                    contentHash: result.contentHash,
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
exports.ConfluenceLoader = ConfluenceLoader;
