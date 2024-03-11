"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiMod = void 0;
const debug_1 = __importDefault(require("debug"));
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const js_tiktoken_1 = require("js-tiktoken");
const base_model_js_1 = require("../interfaces/base-model.cjs");
const base_1 = require("@langchain/core/language_models/base");
class OpenAiMod extends base_model_js_1.BaseModel {
    constructor(temperature, modelName) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:BaseModel')
        });
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = new openai_1.ChatOpenAI({ temperature, modelName });
        this.modelName = modelName;
    }
    getNumTokens(message) {
        const encoder = (0, js_tiktoken_1.encodingForModel)((0, base_1.getModelNameForTiktoken)(this.modelName));
        const tokens = encoder.encode(message);
        return tokens.length;
    }
    getTokenCost(messages, output) {
        var pricing = {
            'gpt-3.5-turbo-0125': {
                'prompt': 0.0005,
                'completion': 0.0015,
            },
            'gpt-3.5-turbo-instruct': {
                'prompt': 0.0015,
                'completion': 0.0020,
            },
            'gpt-4-0125-preview': {
                'prompt': 0.01,
                'completion': 0.03,
            }
        };
        var modelPricing = pricing[this.modelName];
        if (modelPricing) {
            var prompt = '';
            for (var i = 0; i < messages.length; i++) {
                prompt += messages[i].content;
            }
            var numInputTokens = this.getNumTokens(prompt);
            var completionTokens = this.getNumTokens(output);
            var promptCost = numInputTokens * modelPricing.prompt / 1000;
            var completionCost = completionTokens * modelPricing.completion / 1000;
            var totalCost = promptCost + completionCost;
            console.log('\x1b[33m%s\x1b[0m', `Input tokens: ${numInputTokens}`);
            console.log('\x1b[33m%s\x1b[0m', `Output tokens: ${completionTokens}`);
            console.log('\x1b[32m%s\x1b[0m', `Prompt cost: $${promptCost}`);
            console.log('\x1b[32m%s\x1b[0m', `Completion cost: $${completionCost}`);
            console.log('\x1b[35m%s\x1b[0m', `Total cost: $${promptCost + completionCost}`);
            return totalCost;
        }
        return 0;
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new messages_1.SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new messages_1.HumanMessage(message));
        this.debug('Executing openai model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages, {});
        var output = result.content.toString();
        var cost = this.getTokenCost(pastMessages, output);
        return {
            output: output,
            cost: cost
        };
    }
}
exports.OpenAiMod = OpenAiMod;
