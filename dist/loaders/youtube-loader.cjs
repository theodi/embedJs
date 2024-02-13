"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeLoader = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const youtube_transcript_1 = require("youtube-transcript");
const debug_1 = __importDefault(require("debug"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class YoutubeLoader extends base_loader_js_1.BaseLoader {
    constructor({ videoIdOrUrl }) {
        super(`YoutubeLoader_${(0, md5_1.default)(videoIdOrUrl)}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:YoutubeLoader')
        });
        Object.defineProperty(this, "videoIdOrUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.videoIdOrUrl = videoIdOrUrl;
    }
    async *getChunks() {
        const chunker = new text_splitter_1.RecursiveCharacterTextSplitter({ chunkSize: 2000, chunkOverlap: 0 });
        try {
            const transcripts = await youtube_transcript_1.YoutubeTranscript.fetchTranscript(this.videoIdOrUrl, { lang: 'en' });
            this.debug(`Transcripts (length ${transcripts.length}) obtained for video`, this.videoIdOrUrl);
            for (const transcript of transcripts) {
                for (const chunk of await chunker.splitText((0, strings_js_1.cleanString)(transcript.text))) {
                    yield {
                        pageContent: chunk,
                        contentHash: (0, md5_1.default)(chunk),
                        metadata: {
                            type: 'YoutubeLoader',
                            source: this.videoIdOrUrl,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not get transcripts for video', this.videoIdOrUrl, e);
        }
    }
}
exports.YoutubeLoader = YoutubeLoader;
