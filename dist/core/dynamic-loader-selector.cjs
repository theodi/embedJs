"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicLoader = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const debug_1 = __importDefault(require("debug"));
const strings_js_1 = require("../util/strings.cjs");
const docx_loader_js_1 = require("../loaders/docx-loader.cjs");
const excel_loader_js_1 = require("../loaders/excel-loader.cjs");
const web_loader_js_1 = require("../loaders/web-loader.cjs");
const pdf_loader_js_1 = require("../loaders/pdf-loader.cjs");
const ppt_loader_js_1 = require("../loaders/ppt-loader.cjs");
const text_loader_js_1 = require("../loaders/text-loader.cjs");
const sitemap_loader_js_1 = require("../loaders/sitemap-loader.cjs");
const confluence_loader_js_1 = require("../loaders/confluence-loader.cjs");
const youtube_channel_loader_js_1 = require("../loaders/youtube-channel-loader.cjs");
const youtube_search_loader_js_1 = require("../loaders/youtube-search-loader.cjs");
const youtube_loader_js_1 = require("../loaders/youtube-loader.cjs");
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const json_loader_js_1 = require("../loaders/json-loader.cjs");
const url_loader_js_1 = require("../loaders/url-loader.cjs");
const local_path_loader_js_1 = require("../loaders/local-path-loader.cjs");
const csv_loader_js_1 = require("../loaders/csv-loader.cjs");
/**
 * This class generates different types of loaders based on a string input.
 */
class DynamicLoader {
    /**
     * The function `unfurlLoader` determines the type of loader based on the input string and returns
     * the corresponding loader object.
     * @param {string} loader - The `loader` parameter in the `unfurlLoader` function is a string that
     * represents the source from which data will be loaded. It can be a URL, a local file path, a JSON
     * string, or a YouTube video ID. The function checks the type of loader and returns an appropriate
     * @returns The function `unfurlLoader` returns an instance of a subclass of `BaseLoader` based on
     * the type of input `loader` provided. The possible return types are `UrlLoader`,
     * `LocalPathLoader`, `JsonLoader`, or `YoutubeLoader`.
     */
    static async unfurlLoader(loader) {
        if ((0, strings_js_1.isValidURL)(loader)) {
            DynamicLoader.debug('Loader is a valid URL!');
            return new url_loader_js_1.UrlLoader({ url: loader });
        }
        else if (node_fs_1.default.existsSync(node_path_1.default.resolve(loader))) {
            DynamicLoader.debug('Loader is a valid path on local filesystem!');
            return new local_path_loader_js_1.LocalPathLoader({ path: node_path_1.default.resolve(loader) });
        }
        else if ((0, strings_js_1.isValidJson)(loader)) {
            DynamicLoader.debug('Loader is a valid JSON!');
            return new json_loader_js_1.JsonLoader({ object: JSON.parse(loader) });
        }
        else if (loader.length === 11) {
            DynamicLoader.debug('Loader is likely a youtube video id!');
            return new youtube_loader_js_1.YoutubeLoader({ videoIdOrUrl: loader });
        }
        else {
            throw new SyntaxError(`Unknown loader ${loader}`);
        }
    }
    /**
     * The function `createLoader` dynamically creates and returns a loader object based on the input provided.
     * @param {LoaderParam} loader - The `createLoader` function is designed to create a loader based
     * on the input provided. The `loader` parameter can be of type `string`, an instance of
     * `BaseLoader`, or an object with a `type` property specifying the type of loader to create.
     * @returns The `createLoader` function returns a Promise that resolves to an instance of a
     * specific type of loader based on the input `loader` parameter. The function checks the type of
     * the `loader` parameter and returns different loader instances based on the type or properties of
     * the input.
     */
    static async createLoader(loader) {
        if (typeof loader === 'string') {
            DynamicLoader.debug('Loader is of type string; unfurling');
            return await DynamicLoader.unfurlLoader(loader);
        }
        if (loader instanceof base_loader_js_1.BaseLoader) {
            DynamicLoader.debug('Loader is of type BaseLoader; returning as is');
            return loader;
        }
        if (loader.type) {
            DynamicLoader.debug('Loader is an object of specific type; 1to1 match can be done...');
            switch (loader.type) {
                case 'Confluence':
                    return new confluence_loader_js_1.ConfluenceLoader(loader);
                case 'Web':
                    return new web_loader_js_1.WebLoader(loader);
                case 'Doc':
                    return new docx_loader_js_1.DocxLoader(loader);
                case 'Excel':
                    return new excel_loader_js_1.ExcelLoader(loader);
                case 'Json':
                    return new json_loader_js_1.JsonLoader(loader);
                case 'Pdf':
                    return new pdf_loader_js_1.PdfLoader(loader);
                case 'Ppt':
                    return new ppt_loader_js_1.PptLoader(loader);
                case 'Sitemap':
                    return new sitemap_loader_js_1.SitemapLoader(loader);
                case 'Text':
                    return new text_loader_js_1.TextLoader(loader);
                case 'YoutubeChannel':
                    return new youtube_channel_loader_js_1.YoutubeChannelLoader(loader);
                case 'Youtube':
                    return new youtube_loader_js_1.YoutubeLoader(loader);
                case 'YoutubeSearch':
                    return new youtube_search_loader_js_1.YoutubeSearchLoader(loader);
                case 'LocalPath':
                    return new local_path_loader_js_1.LocalPathLoader(loader);
                case 'Url':
                    return new url_loader_js_1.UrlLoader(loader);
                case 'Csv':
                    return new csv_loader_js_1.CsvLoader(loader);
                default:
                    throw new SyntaxError(`Unknown loader type ${loader.type}`);
            }
        }
        DynamicLoader.debug('Loader could not be parsed!');
        throw new SyntaxError(`Unknown loader ${loader}`);
    }
    /**
     * The function `createLoaders` asynchronously creates multiple loaders using the provided
     * parameters and returns them as an array.
     * @param {LoaderParam[]} loaders - An array of LoaderParam objects.
     * @returns An array of BaseLoader objects is being returned after creating loaders using the
     * DynamicLoader class.
     */
    static async createLoaders(loaders) {
        return await Promise.all(loaders.map(DynamicLoader.createLoader));
    }
}
exports.DynamicLoader = DynamicLoader;
Object.defineProperty(DynamicLoader, "debug", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (0, debug_1.default)('embedjs:DynamicLoader')
});
