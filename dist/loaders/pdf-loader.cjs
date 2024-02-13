"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const fs = __importStar(require("node:fs/promises"));
const pdf_parse_fork_1 = __importDefault(require("pdf-parse-fork"));
const axios_1 = __importDefault(require("axios"));
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
        let fileBuffer;
        if (!this.isUrl)
            fileBuffer = await fs.readFile(this.pathOrUrl);
        else
            fileBuffer = Buffer.from((await axios_1.default.get(this.pathOrUrl, { responseType: 'arraybuffer' })).data, 'binary');
        const pdfParsed = await (0, pdf_parse_fork_1.default)(fileBuffer);
        const chunks = await chunker.splitText((0, strings_js_1.cleanString)(pdfParsed.text));
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
