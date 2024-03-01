"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gemini = void 0;
const debug_1 = __importDefault(require("debug"));
const google_genai_1 = require("@langchain/google-genai");
const generative_ai_1 = require("@google/generative-ai");
const messages_1 = require("@langchain/core/messages");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class Gemini extends base_model_js_1.BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:GeminiPro')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = modelName ? modelName : 'gemini-pro';
    }
    async init() {
        this.model = new google_genai_1.ChatGoogleGenerativeAI({
            modelName: this.modelName,
            maxOutputTokens: 4096,
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
            ],
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new messages_1.SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new messages_1.HumanMessage(message));
        this.debug('Executing gemini model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages, {});
        var output = result.content.toString();
        // var cost = this.getTokenCost(pastMessages, output);
        return {
            output: output,
            cost: 0
        };
    }
}
exports.Gemini = Gemini;
