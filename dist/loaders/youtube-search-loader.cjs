"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeSearchLoader = void 0;
const md5_1 = __importDefault(require("md5"));
const usetube_1 = __importDefault(require("usetube"));
const debug_1 = __importDefault(require("debug"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const youtube_channel_loader_js_1 = require("./youtube-channel-loader.cjs");
class YoutubeSearchLoader extends base_loader_js_1.BaseLoader {
    constructor({ searchString }) {
        super(`YoutubeSearchLoader${(0, md5_1.default)(searchString)}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:YoutubeSearchLoader')
        });
        Object.defineProperty(this, "searchString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.searchString = searchString;
    }
    async *getChunks() {
        try {
            const { channels } = await usetube_1.default.searchChannel(this.searchString);
            this.debug(`Search for channels with search string '${this.searchString}' found ${channels.length} entries`);
            const channelIds = channels.map((c) => c.channel_id);
            for (const channelId of channelIds) {
                const youtubeLoader = new youtube_channel_loader_js_1.YoutubeChannelLoader({ channelId });
                for await (const chunk of youtubeLoader.getChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'YoutubeSearchLoader',
                            originalSource: this.searchString,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not search for string', this.searchString, e);
        }
    }
}
exports.YoutubeSearchLoader = YoutubeSearchLoader;
