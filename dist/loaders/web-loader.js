import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import createDebugMessages from 'debug';
import { convert } from 'html-to-text';
import axios from 'axios';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString, isValidURL, truncateCenterString } from '../util/strings.js';
export class WebLoader extends BaseLoader {
    constructor({ urlOrContent, chunkSize, chunkOverlap, }) {
        super(`WebLoader_${md5(urlOrContent)}`, { urlOrContent }, chunkSize ?? 2000, chunkOverlap ?? 0);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:loader:WebLoader')
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
        this.isUrl = isValidURL(urlOrContent) ? true : false;
        this.urlOrContent = urlOrContent;
        ``;
    }
    async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });
        try {
            const data = this.isUrl
                ? (await axios.get(this.urlOrContent, { responseType: 'document' })).data
                : this.urlOrContent;
            const text = convert(data, {
                wordwrap: false,
                preserveNewlines: false,
            }).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
            const tuncatedObjectString = this.isUrl ? undefined : truncateCenterString(this.urlOrContent, 50);
            const chunks = await chunker.splitText(cleanString(text));
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
