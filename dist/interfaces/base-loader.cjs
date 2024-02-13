"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLoader = void 0;
const debug_1 = __importDefault(require("debug"));
const node_events_1 = require("node:events");
class BaseLoader extends node_events_1.EventEmitter {
    static setCache(cache) {
        BaseLoader.cache = cache;
    }
    constructor(uniqueId, canIncrementallyLoad = false) {
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
        this.uniqueId = uniqueId;
        this._canIncrementallyLoad = canIncrementallyLoad;
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
}
exports.BaseLoader = BaseLoader;
