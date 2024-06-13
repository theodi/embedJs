import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString, truncateCenterString } from '../util/strings.js';
export class JsonLoader extends BaseLoader {
    constructor({ object, pickKeysForEmbedding, }) {
        super(`JsonLoader_${md5(cleanString(JSON.stringify(object)))}`, {
            object: truncateCenterString(JSON.stringify(object), 50),
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
        const tuncatedObjectString = truncateCenterString(JSON.stringify(this.object), 50);
        const array = Array.isArray(this.object) ? this.object : [this.object];
        let i = 0;
        for (const entry of array) {
            let s;
            if (this.pickKeysForEmbedding) {
                const subset = Object.fromEntries(this.pickKeysForEmbedding
                    .filter((key) => key in entry) // line can be removed to make it inclusive
                    .map((key) => [key, entry[key]]));
                s = cleanString(JSON.stringify(subset));
            }
            else {
                s = cleanString(JSON.stringify(entry));
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
