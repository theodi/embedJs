"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapLoader = void 0;
const md5_1 = __importDefault(require("md5"));
const sitemapper_1 = __importDefault(require("sitemapper"));
const debug_1 = __importDefault(require("debug"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const web_loader_js_1 = require("./web-loader.cjs");
class SitemapLoader extends base_loader_js_1.BaseLoader {
    constructor({ url }) {
        super(`SitemapLoader_${(0, md5_1.default)(url)}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:SitemapLoader')
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
    async *getChunks() {
        try {
            // @ts-ignore
            const { sites } = await new sitemapper_1.default({ url: this.url, timeout: 15000 }).fetch();
            this.debug(`Sitemap '${this.url}' returned ${sites.length} URLs`);
            for (const url of sites) {
                const webLoader = new web_loader_js_1.WebLoader({ url });
                for await (const chunk of webLoader.getChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'SitemapLoader',
                            originalSource: this.url,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not get sites from sitemap url', this.url, e);
        }
    }
}
exports.SitemapLoader = SitemapLoader;
