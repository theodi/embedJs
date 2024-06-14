import { MongoClient } from 'mongodb';
export class MongoCache {
    constructor({ uri, dbName, collectionName }) {
        Object.defineProperty(this, "uri", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "collectionName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.uri = uri;
        this.dbName = dbName;
        this.collectionName = collectionName;
    }
    async init() {
        this.client = new MongoClient(this.uri);
        await this.client.connect();
        // Create index on loaderId field
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        try {
            await collection.createIndex({ loaderId: 1 }, { unique: true });
        }
        catch (error) {
            //this.debug('Index on loaderId already exists.');
        }
    }
    async addLoader(loaderId, chunkCount) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.insertOne({ loaderId, chunkCount });
    }
    async getLoader(loaderId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({ loaderId });
        return { chunkCount: result ? result.chunkCount : 0 }; // Assuming a default value of 0 if result is null
    }
    async hasLoader(loaderId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({ loaderId });
        return !!result;
    }
    async loaderCustomSet(loaderCombinedId, value) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.updateOne({ loaderId: loaderCombinedId }, { $setOnInsert: { loaderId: loaderCombinedId, value } }, { upsert: false });
        if (result.matchedCount === 0) {
            await collection.insertOne({ loaderId: loaderCombinedId, value });
        }
    }
    async loaderCustomGet(loaderCombinedId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({ loaderId: loaderCombinedId });
        return result?.value;
    }
    async loaderCustomHas(loaderCombinedId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({ loaderId: loaderCombinedId });
        return !!result;
    }
    async clear() {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.deleteMany({});
    }
    async deleteLoader(loaderId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.deleteOne({ loaderId });
    }
    async loaderCustomDelete(loaderCombinedId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.deleteOne({ loaderId: loaderCombinedId });
    }
    async close() {
        await this.client.close();
    }
}
