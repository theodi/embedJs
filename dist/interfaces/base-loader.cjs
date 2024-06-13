"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLoader = void 0;
const md5_1 = __importDefault(require("md5"));
const debug_1 = __importDefault(require("debug"));
const node_events_1 = require("node:events");
class BaseLoader extends node_events_1.EventEmitter {
    static setCache(cache) {
        BaseLoader.cache = cache;
    }
    static async recordLoaderInCache(loaderName, uniqueId, loaderMetadata) {
        if (!BaseLoader.cache)
            return;
        if (await BaseLoader.cache.loaderCustomHas(BaseLoader.LOADERS_LIST_CACHE_KEY)) {
            const current = await BaseLoader.cache.loaderCustomGet(BaseLoader.LOADERS_LIST_CACHE_KEY);
            current.list.push({
                type: loaderName,
                uniqueId,
                loaderMetadata,
            });
            current.list = [...new Map(current.list.map((item) => [item.uniqueId, item])).values()];
            BaseLoader.cache.loaderCustomSet(BaseLoader.LOADERS_LIST_CACHE_KEY, current);
        }
        else {
            BaseLoader.cache.loaderCustomSet(BaseLoader.LOADERS_LIST_CACHE_KEY, {
                list: [
                    {
                        type: loaderName,
                        uniqueId,
                        loaderMetadata,
                    },
                ],
            });
        }
    }
    static async getLoadersList() {
        if (!BaseLoader.cache)
            return null;
        if (await BaseLoader.cache.loaderCustomHas(BaseLoader.LOADERS_LIST_CACHE_KEY)) {
            const current = await BaseLoader.cache.loaderCustomGet(BaseLoader.LOADERS_LIST_CACHE_KEY);
            return current.list;
        }
        else
            return [];
    }
    constructor(uniqueId, loaderMetadata, chunkSize = 5, chunkOverlap = 0, canIncrementallyLoad = false) {
        super();
        Object.defineProperty(this, "uniqueId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_canIncrementallyLoad", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkOverlap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "chunkSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.uniqueId = uniqueId;
        this._canIncrementallyLoad = canIncrementallyLoad;
        this.chunkOverlap = chunkOverlap;
        this.chunkSize = chunkSize;
        BaseLoader.recordLoaderInCache(this.constructor.name, uniqueId, loaderMetadata);
        (0, debug_1.default)('embedjs:loader:BaseLoader')(`New loader class initalized with key ${uniqueId}`);
    }
    async init() { }
    get canIncrementallyLoad() {
        return this._canIncrementallyLoad;
    }
    getUniqueId() {
        return this.uniqueId;
    }
    getCustomCacheKey(key) {
        return `LOADER_CUSTOM_${this.uniqueId}_${key}`;
    }
    async checkInCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomHas(this.getCustomCacheKey(key));
    }
    async getFromCache(key) {
        if (!BaseLoader.cache)
            return null;
        return BaseLoader.cache.loaderCustomGet(this.getCustomCacheKey(key));
    }
    async saveToCache(key, value) {
        if (!BaseLoader.cache)
            return;
        await BaseLoader.cache.loaderCustomSet(this.getCustomCacheKey(key), value);
    }
    async deleteFromCache(key) {
        if (!BaseLoader.cache)
            return false;
        return BaseLoader.cache.loaderCustomDelete(this.getCustomCacheKey(key));
    }
    async loadIncrementalChunk(incrementalGenerator) {
        this.emit('incrementalChunkAvailable', incrementalGenerator);
    }
    /**
     * This TypeScript function asynchronously processes chunks of data, cleans up the content,
     * calculates a content hash, and yields the modified chunks.
     */
    async *getChunks() {
        const chunks = await this.getUnfilteredChunks();
        for await (const chunk of chunks) {
            chunk.pageContent = chunk.pageContent
                .replace(/(\r\n|\n|\r)/gm, ' ')
                .replace(/\s\s+/g, ' ')
                .trim();
            if (chunk.pageContent.length > 0) {
                yield {
                    ...chunk,
                    contentHash: (0, md5_1.default)(chunk.pageContent),
                };
            }
        }
    }
}
exports.BaseLoader = BaseLoader;
Object.defineProperty(BaseLoader, "LOADERS_LIST_CACHE_KEY", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'LOADERS_LIST_CACHE_KEY'
});
