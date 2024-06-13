"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPathLoader = void 0;
const stream_mmmagic_1 = __importDefault(require("stream-mmmagic"));
const debug_1 = __importDefault(require("debug"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const md5_1 = __importDefault(require("md5"));
const base_loader_js_1 = require("../interfaces/base-loader.cjs");
const mime_js_1 = require("../util/mime.cjs");
class LocalPathLoader extends base_loader_js_1.BaseLoader {
    constructor({ path }) {
        super(`LocalPathLoader_${(0, md5_1.default)(path)}`, { path });
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:loader:LocalPathLoader')
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
        const isDir = node_fs_1.default.lstatSync(currentPath).isDirectory();
        this.debug(`Processing path '${currentPath}'. It is a ${isDir ? 'Directory!' : 'file...'}`);
        if (!isDir) {
            const stream = node_fs_1.default.createReadStream(currentPath);
            const mime = (await stream_mmmagic_1.default.promise(stream))[0].type;
            this.debug(`File '${this.path}' has mime type '${mime}'`);
            stream.destroy();
            const loader = await (0, mime_js_1.createLoaderFromMimeType)(currentPath, mime);
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
            const files = node_fs_1.default.readdirSync(currentPath);
            this.debug(`Dir '${currentPath}' has ${files.length} entries inside`, files);
            for (const file of files) {
                for await (const result of await this.recursivelyAddPath(node_path_1.default.resolve(currentPath, file))) {
                    yield result;
                }
            }
        }
    }
}
exports.LocalPathLoader = LocalPathLoader;
