"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mistral = void 0;
const debug_1 = __importDefault(require("debug"));
const mistralai_1 = require("@langchain/mistralai");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class Mistral extends base_model_js_1.BaseModel {
    constructor({ temperature, accessToken, modelName, }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:Mistral')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new mistralai_1.ChatMistralAI({ apiKey: accessToken, modelName: modelName ?? 'mistral-medium' });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new messages_1.SystemMessage(system)];
        pastMessages.push(new messages_1.SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`));
        pastMessages.push.apply(pastMessages, pastConversations.map((c) => {
            if (c.sender === 'AI')
                return new messages_1.AIMessage({
                    content: c.message,
                });
            return new messages_1.HumanMessage({
                content: c.message,
            });
        }));
        pastMessages.push(new messages_1.HumanMessage(`${userQuery}?`));
        this.debug('Executing mistral model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        return {
            output: result.content.toString(),
            cost: 0
        };
    }
}
exports.Mistral = Mistral;
