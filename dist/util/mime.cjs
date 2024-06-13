"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoaderFromMimeType = void 0;
const mime_1 = __importDefault(require("mime"));
const debug_1 = __importDefault(require("debug"));
const docx_loader_js_1 = require("../loaders/docx-loader.cjs");
const excel_loader_js_1 = require("../loaders/excel-loader.cjs");
const pdf_loader_js_1 = require("../loaders/pdf-loader.cjs");
const ppt_loader_js_1 = require("../loaders/ppt-loader.cjs");
const sitemap_loader_js_1 = require("../loaders/sitemap-loader.cjs");
const text_loader_js_1 = require("../loaders/text-loader.cjs");
const web_loader_js_1 = require("../loaders/web-loader.cjs");
const csv_loader_js_1 = require("../loaders/csv-loader.cjs");
async function createLoaderFromMimeType(loader, mimeType) {
    switch (mimeType) {
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return new docx_loader_js_1.DocxLoader({ filePathOrUrl: loader });
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return new excel_loader_js_1.ExcelLoader({ filePathOrUrl: loader });
        case 'application/pdf':
            return new pdf_loader_js_1.PdfLoader({ filePathOrUrl: loader });
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return new ppt_loader_js_1.PptLoader({ filePathOrUrl: loader });
        case 'text/plain':
            const fineType = mime_1.default.getType(loader);
            (0, debug_1.default)('embedjs:createLoaderFromMimeType')(`Fine type for '${loader}' is '${fineType}'`);
            if (fineType === 'text/csv')
                return new csv_loader_js_1.CsvLoader({ filePathOrUrl: loader });
            else
                return new text_loader_js_1.TextLoader({ text: loader });
        case 'text/html':
            return new web_loader_js_1.WebLoader({ urlOrContent: loader });
        case 'text/xml':
            if (await sitemap_loader_js_1.SitemapLoader.test(loader)) {
                return new sitemap_loader_js_1.SitemapLoader({ url: loader });
            }
            throw new SyntaxError(`No processor found for generic xml`);
        default:
            throw new SyntaxError(`Unknown mime type '${mimeType}'`);
    }
}
exports.createLoaderFromMimeType = createLoaderFromMimeType;
