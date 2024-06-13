"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvLoader = void 0;
const csv_parse_1 = require("csv-parse");
const debug_1 = __importDefault(require("debug"));
const axios_1 = __importDefault(require("axios"));
const node_fs_1 = __importDefault(require("node:fs"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
const stream_js_1 = require("../util/stream.cjs");
class CsvLoader extends base_loader_js_1.BaseLoader {
    constructor({ filePathOrUrl, csvParseOptions, chunkOverlap, chunkSize, }) {
        super(`CsvLoader_${(0, md5_1.default)(filePathOrUrl)}`, { filePathOrUrl }, chunkSize ?? 1000, chunkOverlap ?? 0);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:CsvLoader')
        });
        Object.defineProperty(this, "csvParseOptions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        this.csvParseOptions = csvParseOptions ?? { autoParse: true };
    }
    async *getUnfilteredChunks() {
        const stream = await (0, stream_js_1.stream2buffer)(this.isUrl
            ? (await axios_1.default.get(this.filePathOrUrl, { responseType: 'stream' })).data
            : node_fs_1.default.createReadStream(this.filePathOrUrl));
        this.debug('CsvParser stream created');
        const parser = (0, csv_parse_1.parse)(stream, this.csvParseOptions);
        this.debug('CSV parsing started...');
        let i = 0;
        for await (const record of parser) {
            yield {
                pageContent: (0, strings_js_1.cleanString)(record.join(',')),
                metadata: {
                    type: 'CsvLoader',
                    source: this.filePathOrUrl,
                },
            };
            i++;
        }
        this.debug(`CsvParser for filePathOrUrl '${this.filePathOrUrl}' resulted in ${i} entries`);
    }
}
exports.CsvLoader = CsvLoader;
