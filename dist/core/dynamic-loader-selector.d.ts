import { DocxLoader } from '../loaders/docx-loader.js';
import { ExcelLoader } from '../loaders/excel-loader.js';
import { WebLoader } from '../loaders/web-loader.js';
import { PdfLoader } from '../loaders/pdf-loader.js';
import { PptLoader } from '../loaders/ppt-loader.js';
import { TextLoader } from '../loaders/text-loader.js';
import { SitemapLoader } from '../loaders/sitemap-loader.js';
import { ConfluenceLoader } from '../loaders/confluence-loader.js';
import { YoutubeChannelLoader } from '../loaders/youtube-channel-loader.js';
import { YoutubeSearchLoader } from '../loaders/youtube-search-loader.js';
import { YoutubeLoader } from '../loaders/youtube-loader.js';
import { BaseLoader } from '../interfaces/base-loader.js';
import { JsonLoader } from '../loaders/json-loader.js';
import { UrlLoader } from '../loaders/url-loader.js';
import { LocalPathLoader } from '../loaders/local-path-loader.js';
import { CsvLoader } from '../loaders/csv-loader.js';
export type LoaderParam = string | BaseLoader | ({
    type: 'Confluence';
} & ConstructorParameters<typeof ConfluenceLoader>[0]) | ({
    type: 'Web';
} & ConstructorParameters<typeof WebLoader>[0]) | ({
    type: 'Doc';
} & ConstructorParameters<typeof DocxLoader>[0]) | ({
    type: 'Excel';
} & ConstructorParameters<typeof ExcelLoader>[0]) | ({
    type: 'Json';
} & ConstructorParameters<typeof JsonLoader>[0]) | ({
    type: 'Pdf';
} & ConstructorParameters<typeof PdfLoader>[0]) | ({
    type: 'Ppt';
} & ConstructorParameters<typeof PptLoader>[0]) | ({
    type: 'Sitemap';
} & ConstructorParameters<typeof SitemapLoader>[0]) | ({
    type: 'Text';
} & ConstructorParameters<typeof TextLoader>[0]) | ({
    type: 'YoutubeChannel';
} & ConstructorParameters<typeof YoutubeChannelLoader>[0]) | ({
    type: 'Youtube';
} & ConstructorParameters<typeof YoutubeLoader>[0]) | ({
    type: 'YoutubeSearch';
} & ConstructorParameters<typeof YoutubeSearchLoader>[0]) | ({
    type: 'LocalPath';
} & ConstructorParameters<typeof LocalPathLoader>[0]) | ({
    type: 'Url';
} & ConstructorParameters<typeof UrlLoader>[0]) | ({
    type: 'Csv';
} & ConstructorParameters<typeof CsvLoader>[0]);
/**
 * This class generates different types of loaders based on a string input.
 */
export declare class DynamicLoader {
    private static readonly debug;
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
    private static unfurlLoader;
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
    static createLoader(loader: LoaderParam): Promise<BaseLoader>;
    /**
     * The function `createLoaders` asynchronously creates multiple loaders using the provided
     * parameters and returns them as an array.
     * @param {LoaderParam[]} loaders - An array of LoaderParam objects.
     * @returns An array of BaseLoader objects is being returned after creating loaders using the
     * DynamicLoader class.
     */
    static createLoaders(loaders: LoaderParam[]): Promise<BaseLoader[]>;
}
