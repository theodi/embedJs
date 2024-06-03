"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const office_text_extractor_1 = require("office-text-extractor");
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class PdfLoader extends base_loader_js_1.BaseLoader {
    constructor({ filePath, url }) {
        super(`PdfLoader_${(0, md5_1.default)(filePath ? `FILE_${filePath}` : `URL_${url}`)}`);
        Object.defineProperty(this, "pathOrUrl", {
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
        this.isUrl = filePath ? false : true;
        this.pathOrUrl = filePath ?? url;
    }
    async *getChunks() {
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });
        const extractor = (0, office_text_extractor_1.getTextExtractor)();
        const pdfParsed = await extractor.extractText({ input: this.pathOrUrl, type: this.isUrl ? 'url' : 'file' });
        const chunks = await chunker.splitText((0, strings_js_1.cleanString)(pdfParsed));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                contentHash: (0, md5_1.default)(chunk),
                metadata: {
                    type: 'PdfLoader',
                    source: this.pathOrUrl,
                },
            };
        }
    }
}
exports.PdfLoader = PdfLoader;
