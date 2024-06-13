import magic from 'stream-mmmagic';
import createDebugMessages from 'debug';
import path from 'node:path';
import fs from 'node:fs';
import md5 from 'md5';
import { BaseLoader } from '../interfaces/base-loader.js';
import { createLoaderFromMimeType } from '../util/mime.js';
export class LocalPathLoader extends BaseLoader {
    constructor({ path }) {
        super(`LocalPathLoader_${md5(path)}`, { path });
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:loader:LocalPathLoader')
        });
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.path = path;
    }
    async *getUnfilteredChunks() {
        for await (const result of await this.recursivelyAddPath(this.path)) {
            yield {
                ...result,
                metadata: {
                    ...result.metadata,
                    type: 'LocalPathLoader',
                    originalPath: this.path,
                },
            };
        }
    }
    async *recursivelyAddPath(currentPath) {
        const isDir = fs.lstatSync(currentPath).isDirectory();
        this.debug(`Processing path '${currentPath}'. It is a ${isDir ? 'Directory!' : 'file...'}`);
        if (!isDir) {
            const stream = fs.createReadStream(currentPath);
            const mime = (await magic.promise(stream))[0].type;
            this.debug(`File '${this.path}' has mime type '${mime}'`);
            stream.destroy();
            const loader = await createLoaderFromMimeType(currentPath, mime);
            for await (const result of await loader.getUnfilteredChunks()) {
                yield {
                    pageContent: result.pageContent,
                    metadata: {
                        source: currentPath,
                    },
                };
            }
        }
        else {
            const files = fs.readdirSync(currentPath);
            this.debug(`Dir '${currentPath}' has ${files.length} entries inside`, files);
            for (const file of files) {
                for await (const result of await this.recursivelyAddPath(path.resolve(currentPath, file))) {
                    yield result;
                }
            }
        }
    }
}
