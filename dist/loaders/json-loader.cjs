"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonLoader = void 0;
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const strings_js_1 = require("../util/strings.cjs");
class JsonLoader extends base_loader_js_1.BaseLoader {
    constructor({ object, pickKeysForEmbedding, }) {
        super(`JsonLoader_${(0, md5_1.default)((0, strings_js_1.cleanString)(JSON.stringify(object)))}`, {
            object: (0, strings_js_1.truncateCenterString)(JSON.stringify(object), 50),
        });
        Object.defineProperty(this, "object", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pickKeysForEmbedding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.pickKeysForEmbedding = pickKeysForEmbedding;
        this.object = object;
    }
    async *getUnfilteredChunks() {
        const tuncatedObjectString = (0, strings_js_1.truncateCenterString)(JSON.stringify(this.object), 50);
        const array = Array.isArray(this.object) ? this.object : [this.object];
        let i = 0;
        for (const entry of array) {
            let s;
            if (this.pickKeysForEmbedding) {
                const subset = Object.fromEntries(this.pickKeysForEmbedding
                    .filter((key) => key in entry) // line can be removed to make it inclusive
                    .map((key) => [key, entry[key]]));
                s = (0, strings_js_1.cleanString)(JSON.stringify(subset));
            }
            else {
                s = (0, strings_js_1.cleanString)(JSON.stringify(entry));
            }
            if ('id' in entry) {
                entry.preEmbedId = entry.id;
                delete entry.id;
            }
            yield {
                pageContent: s,
                metadata: {
                    type: 'JsonLoader',
                    source: tuncatedObjectString,
                    ...entry,
                },
            };
            i++;
        }
    }
}
exports.JsonLoader = JsonLoader;
