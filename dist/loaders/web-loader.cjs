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
    constructor({ urlOrContent, chunkSize, chunkOverlap, }) {
        super(`WebLoader_${(0, md5_1.default)(urlOrContent)}`, { urlOrContent }, chunkSize ?? 2000, chunkOverlap ?? 0);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:WebLoader')
        });
        Object.defineProperty(this, "urlOrContent", {
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
        this.isUrl = (0, strings_js_1.isValidURL)(urlOrContent) ? true : false;
        this.urlOrContent = urlOrContent;
        ``;
    }
    async *getUnfilteredChunks() {
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        try {
            const data = this.isUrl
                ? (await axios_1.default.get(this.urlOrContent, { responseType: 'document' })).data
                : this.urlOrContent;
            const text = (0, html_to_text_1.convert)(data, {
                wordwrap: false,
                preserveNewlines: false,
            }).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            const tuncatedObjectString = this.isUrl ? undefined : (0, strings_js_1.truncateCenterString)(this.urlOrContent, 50);
            const chunks = await chunker.splitText((0, strings_js_1.cleanString)(text));
            for (const chunk of chunks) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        type: 'WebLoader',
                        source: this.isUrl ? this.urlOrContent : tuncatedObjectString,
                    },
                };
            }
        }
        catch (e) {
            this.debug('Could not parse input', this.urlOrContent, e);
        }
    }
}
exports.WebLoader = WebLoader;
