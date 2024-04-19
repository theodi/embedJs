"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConversations = void 0;
const mongodb_1 = require("mongodb");
class MongoConversations {
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
        this.client = new mongodb_1.MongoClient(this.uri);
        await this.client.connect();
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.createIndex({ conversationId: 1 });
        await collection.createIndex({ "entries._id": 1 });
    }
    async addConversation(conversationId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        // Check if conversation already exists to prevent duplication
        const exists = await this.hasConversation(conversationId);
        if (!exists) {
            await collection.insertOne({ conversationId, entries: [] });
        }
    }
    async getConversation(conversationId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const document = await collection.findOne({ conversationId });
        if (!document) {
            // If not found, create a new one automatically
            await this.addConversation(conversationId);
            return { conversationId, entries: [] };
        }
        return {
            conversationId: document.conversationId,
            entries: document.entries
        };
    }
    async hasConversation(conversationId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        const result = await collection.findOne({ conversationId });
        return !!result;
    }
    async deleteConversation(conversationId) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.deleteOne({ conversationId });
    }
    async addEntryToConversation(conversationId, entry) {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.updateOne({ conversationId }, { $push: { entries: entry } } // Correctly structured $push operation
        );
    }
    async clearConversations() {
        const collection = this.client.db(this.dbName).collection(this.collectionName);
        await collection.deleteMany({});
    }
    async close() {
        await this.client.close();
    }
}
exports.MongoConversations = MongoConversations;
