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
exports.LanceDb = void 0;
const fsOld = __importStar(require("node:fs"));
const fs = __importStar(require("node:fs/promises"));
const vectordb_1 = require("vectordb");
class LanceDb {
    constructor({ path, isTemp }) {
        Object.defineProperty(this, "isTemp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "table", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.isTemp = isTemp !== undefined ? isTemp : false;
        this.path = path;
    }
    async init({ dimensions }) {
        if (!this.isTemp && !fsOld.existsSync(this.path)) {
            await fs.mkdir(this.path);
        }
        const dir = await (this.isTemp ? fs.mkdtemp(this.path) : this.path);
        const client = await (0, vectordb_1.connect)(dir);
        const list = await client.tableNames();
        if (list.indexOf(LanceDb.STATIC_DB_NAME) > -1)
            this.table = await client.openTable(LanceDb.STATIC_DB_NAME);
        else {
            //TODO: You can add a proper schema instead of a sample record now but it requires another package apache-arrow; another install on downstream as well
            this.table = await client.createTable(LanceDb.STATIC_DB_NAME, [
                {
                    id: 'md5',
                    pageContent: 'sample',
                    vector: Array(dimensions),
                    uniqueLoaderId: 'sample',
                    metadata: 'sample',
                },
            ]);
        }
    }
    async insertChunks(chunks) {
        const mapped = chunks.map((chunk) => {
            const uniqueLoaderId = chunk.metadata.uniqueLoaderId;
            delete chunk.metadata.uniqueLoaderId;
            return {
                id: chunk.metadata.id,
                pageContent: chunk.pageContent,
                vector: chunk.vector,
                uniqueLoaderId,
                metadata: JSON.stringify(chunk.metadata),
            };
        });
        await this.table.add(mapped);
        return mapped.length; //TODO: check if vectorDb has addressed the issue where add returns undefined
    }
    async similaritySearch(query, k) {
        const results = await this.table.search(query).limit(k).execute();
        return (results
            //a mandatory record is required by lance during init to get schema
            //and this record is also returned in results; we filter it out
            .filter((entry) => entry.id !== 'md5')
            .map((result) => {
            const metadata = JSON.parse(result.metadata);
            metadata.uniqueLoaderId = result.uniqueLoaderId;
            return {
                pageContent: result.pageContent,
                metadata,
            };
        }));
    }
    async getVectorCount() {
        return this.table.countRows();
    }
    async deleteKeys(uniqueLoaderId) {
        await this.table.delete(`\`uniqueLoaderId\` = "${uniqueLoaderId}"`);
        return true;
    }
    async reset() {
        await this.table.delete('id IS NOT NULL');
    }
}
exports.LanceDb = LanceDb;
Object.defineProperty(LanceDb, "STATIC_DB_NAME", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'vectors'
});
