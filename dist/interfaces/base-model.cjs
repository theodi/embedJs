"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const debug_1 = __importDefault(require("debug"));
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
        const result = await this.runQuery(system, userQuery, supportingContext, conversation.entries);
        // Add user query to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            timestamp: new Date(),
            sender: 'HUMAN',
            message: userQuery
        });
        // Add AI response to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            timestamp: new Date(),
            sender: 'AI',
            message: result
        });
        return result;
    }
}
exports.BaseModel = BaseModel;
