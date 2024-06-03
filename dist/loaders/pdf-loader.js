import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getTextExtractor } from 'office-text-extractor';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
export class PdfLoader extends BaseLoader {
    constructor({ filePath, url }) {
        super(`PdfLoader_${md5(filePath ? `FILE_${filePath}` : `URL_${url}`)}`);
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
        const chunker = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 0 });
        const extractor = getTextExtractor();
        const pdfParsed = await extractor.extractText({ input: this.pathOrUrl, type: this.isUrl ? 'url' : 'file' });
        const chunks = await chunker.splitText(cleanString(pdfParsed));
        for (const chunk of chunks) {
            yield {
                pageContent: chunk,
                contentHash: md5(chunk),
                metadata: {
                    type: 'PdfLoader',
                    source: this.pathOrUrl,
                },
            };
        }
    }
}
