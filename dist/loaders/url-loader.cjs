"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLoader = void 0;
const stream_mmmagic_1 = __importDefault(require("stream-mmmagic"));
const debug_1 = __importDefault(require("debug"));
const axios_1 = __importDefault(require("axios"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const mime_js_1 = require("../util/mime.cjs");
const strings_js_1 = require("../util/strings.cjs");
class UrlLoader extends base_loader_js_1.BaseLoader {
    constructor({ url }) {
        super(`UrlLoader_${(0, md5_1.default)(url)}`, { url: (0, strings_js_1.truncateCenterString)(url, 50) });
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:UrlLoader')
        });
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.url = url;
    }
    async *getUnfilteredChunks() {
        this.debug('Loader is a valid URL!');
        const stream = (await axios_1.default.get(this.url, { responseType: 'stream' })).data;
        const mime = (await stream_mmmagic_1.default.promise(stream))[0].type;
        this.debug(`Loader type detected as '${mime}'`);
        stream.destroy();
        const loader = await (0, mime_js_1.createLoaderFromMimeType)(this.url, mime);
        for await (const result of await loader.getUnfilteredChunks()) {
            yield {
                pageContent: result.pageContent,
                metadata: {
                    type: 'UrlLoader',
                    source: this.url,
                },
            };
        }
    }
}
exports.UrlLoader = UrlLoader;
