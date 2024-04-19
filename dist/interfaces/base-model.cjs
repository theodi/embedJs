"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const debug_1 = __importDefault(require("debug"));
const uuid_1 = require("uuid");
class BaseModel {
    constructor(temperature) {
        Object.defineProperty(this, "baseDebug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:BaseModel')
        });
        Object.defineProperty(this, "_temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._temperature = temperature;
    }
    static setDefaultTemperature(temperature) {
        BaseModel.defaultTemperature = temperature;
    }
    static setConversations(conversations) {
        BaseModel.conversations = conversations; // Correct setting of the static property
    }
    get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }
    async init() { }
    async query(system, userQuery, supportingContext, conversationId = 'default') {
        const conversation = await BaseModel.conversations.getConversation(conversationId); // Use static property
        this.baseDebug(`${conversation.entries.length} history entries found for conversationId '${conversationId}'`);
        const uniqueSources = this.extractUniqueSources(supportingContext);
        // Extract only the content from each entry in the conversation
        const pastConversations = conversation.entries.map(entry => entry.content);
        const result = await this.runQuery(system, userQuery, supportingContext, pastConversations);
        // Add user query to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            _id: (0, uuid_1.v4)(),
            timestamp: new Date(),
            content: {
                sender: 'HUMAN',
                message: userQuery
            },
            sources: []
        });
        // Add AI response to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            _id: (0, uuid_1.v4)(),
            timestamp: new Date(),
            content: {
                sender: 'AI',
                message: result.output
            },
            sources: uniqueSources
        });
        return result;
    }
    extractUniqueSources(supportingContext) {
        const sourceSet = new Set(); // Create a Set to hold unique sources
        supportingContext.forEach(item => {
            if (item.metadata && item.metadata.source) {
                sourceSet.add(item.metadata.source); // Add source to Set
            }
        });
        return Array.from(sourceSet); // Convert Set to Array to return
    }
}
exports.BaseModel = BaseModel;
