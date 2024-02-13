"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class TextLoader extends base_loader_js_1.BaseLoader {
    constructor({ text }) {
        super(`TextLoader_${(0, md5_1.default)(text)}`);
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.text = text;
    }
    async *getChunks() {
        const tuncatedObjectString = (0, strings_js_1.truncateCenterString)(this.text, 50);
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 300, chunkOverlap: 0 });
        const chunks = await chunker.splitText((0, strings_js_1.cleanString)(this.text));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                contentHash: (0, md5_1.default)(chunk),
                metadata: {
                    type: 'TextLoader',
                    source: tuncatedObjectString,
                    textId: this.uniqueId,
                },
            };
        }
    }
}
exports.TextLoader = TextLoader;
