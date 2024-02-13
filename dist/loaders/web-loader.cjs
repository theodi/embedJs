"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const debug_1 = __importDefault(require("debug"));
const html_to_text_1 = require("html-to-text");
const axios_1 = __importDefault(require("axios"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class WebLoader extends base_loader_js_1.BaseLoader {
    constructor({ content, url }) {
        super(`WebLoader_${(0, md5_1.default)(content ? `CONTENT_${content}` : `URL_${url}`)}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:WebLoader')
        });
        Object.defineProperty(this, "contentOrUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.isUrl = content ? false : true;
        this.contentOrUrl = content ?? url;
    }
    async *getChunks() {
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 2000, chunkOverlap: 0 });
        try {
            const data = this.isUrl
                ? (await axios_1.default.get(this.contentOrUrl, { responseType: 'document' })).data
                : this.contentOrUrl;
            const text = (0, html_to_text_1.convert)(data, {
                wordwrap: false,
            });
            const tuncatedObjectString = this.isUrl ? undefined : (0, strings_js_1.truncateCenterString)(this.contentOrUrl, 50);
            const chunks = await chunker.splitText((0, strings_js_1.cleanString)(text));
            for (const chunk of chunks) {
                yield {
                    pageContent: chunk,
                    contentHash: (0, md5_1.default)(chunk),
                    metadata: {
                        type: 'WebLoader',
                        source: this.isUrl ? this.contentOrUrl : tuncatedObjectString,
                    },
                };
            }
        }
        catch (e) {
            this.debug('Could not parse input', this.contentOrUrl, e);
        }
    }
}
exports.WebLoader = WebLoader;
