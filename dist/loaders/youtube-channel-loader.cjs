"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeChannelLoader = void 0;
const md5_1 = __importDefault(require("md5"));
const usetube_1 = __importDefault(require("usetube"));
const debug_1 = __importDefault(require("debug"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const youtube_loader_js_1 = require("./youtube-loader.cjs");
class YoutubeChannelLoader extends base_loader_js_1.BaseLoader {
    constructor({ channelId }) {
        super(`YoutubeChannelLoader_${(0, md5_1.default)(channelId)}`);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:YoutubeChannelLoader')
        });
        Object.defineProperty(this, "channelId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.channelId = channelId;
    }
    async *getChunks() {
        try {
            const videos = await usetube_1.default.getChannelVideos(this.channelId);
            this.debug(`Channel '${this.channelId}' returned ${videos.length} videos`);
            const videoIds = videos.map((v) => v.id);
            for (const videoId of videoIds) {
                const youtubeLoader = new youtube_loader_js_1.YoutubeLoader({ videoIdOrUrl: videoId });
                for await (const chunk of youtubeLoader.getChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: 'YoutubeChannelLoader',
                            originalSource: this.channelId,
                        },
                    };
                }
            }
        }
        catch (e) {
            this.debug('Could not get videos for channel', this.channelId, e);
        }
    }
}
exports.YoutubeChannelLoader = YoutubeChannelLoader;
