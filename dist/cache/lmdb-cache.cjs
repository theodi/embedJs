"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmdbCache = void 0;
const lmdb = __importStar(require("lmdb"));
class LmdbCache {
    constructor({ path }) {
        Object.defineProperty(this, "dataPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "database", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.dataPath = path;
    }
    async init() {
        this.database = lmdb.open({
            path: this.dataPath,
            compression: true,
        });
    }
    async addLoader(loaderId, chunkCount) {
        await this.database.put(loaderId, { chunkCount });
    }
    async getLoader(loaderId) {
        return this.database.get(loaderId);
    }
    async hasLoader(loaderId) {
        return this.database.doesExist(loaderId);
    }
    async loaderCustomSet(loaderCombinedId, value) {
        await this.database.put(loaderCombinedId, value);
    }
    async loaderCustomGet(loaderCombinedId) {
        return this.database.get(loaderCombinedId);
    }
    async loaderCustomHas(loaderCombinedId) {
        return this.database.doesExist(loaderCombinedId);
    }
    async deleteLoader(loaderId) {
        await this.database.remove(loaderId);
    }
    async loaderCustomDelete(loaderCombinedId) {
        await this.database.remove(loaderCombinedId);
    }
}
exports.LmdbCache = LmdbCache;
