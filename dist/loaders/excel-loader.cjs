"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const office_text_extractor_1 = require("office-text-extractor");
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class ExcelLoader extends base_loader_js_1.BaseLoader {
    constructor({ filePathOrUrl, chunkOverlap, chunkSize, }) {
        super(`ExcelLoader_${(0, md5_1.default)(filePathOrUrl)}`, { filePathOrUrl }, chunkSize ?? 1000, chunkOverlap ?? 0);
        Object.defineProperty(this, "filePathOrUrl", {
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
        this.filePathOrUrl = filePathOrUrl;
        this.isUrl = (0, strings_js_1.isValidURL)(filePathOrUrl) ? true : false;
    }
    async *getUnfilteredChunks() {
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        const extractor = (0, office_text_extractor_1.getTextExtractor)();
        const xlsxParsed = await extractor.extractText({
            input: this.filePathOrUrl,
            type: this.isUrl ? 'url' : 'file',
        });
        const chunks = await chunker.splitText((0, strings_js_1.cleanString)(xlsxParsed));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                metadata: {
                    type: 'ExcelLoader',
                    source: this.filePathOrUrl,
                },
            };
        }
    }
}
exports.ExcelLoader = ExcelLoader;
