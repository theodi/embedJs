"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuggingFace = void 0;
const debug_1 = __importDefault(require("debug"));
const hf_1 = require("@langchain/community/llms/hf");
const base_model_js_1 = require("../interfaces/base-model.cjs");
class HuggingFace extends base_model_js_1.BaseModel {
    constructor(params) {
        super(params?.temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, debug_1.default)('embedjs:model:HuggingFace')
        });
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxNewTokens", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "endpointUrl", {
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
        this.endpointUrl = params?.endpointUrl;
        this.maxNewTokens = params?.maxNewTokens ?? 300;
        this.modelName = params?.modelName ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1';
    }
    async init() {
        this.model = new hf_1.HuggingFaceInference({
            model: this.modelName,
            maxTokens: this.maxNewTokens,
            temperature: this.temperature,
            endpointUrl: this.endpointUrl,
            verbose: false,
            maxRetries: 1,
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [system];
        pastMessages.push(`Data: ${supportingContext.map((s) => s.pageContent).join('; ')}`);
        // pastMessages.push.apply(
        //     pastConversations.map((c) => {
        //         if (c.sender === 'AI') return `AI: ${c.message}`;
        //         return `HUMAN: ${c.message}`;
        //     }),
        // );
        // pastMessages.push(`Question: ${userQuery}?`);
        // pastMessages.push('Answer: ');
        pastMessages.push(`${userQuery}`);
        const finalPrompt = pastMessages.join('\n');
        // this.debug('Final prompt being sent to HF - ', finalPrompt);
        this.debug(`Executing hugging face '${this.model.model}' model with prompt -`, userQuery);
        const result = await this.model.invoke(finalPrompt, {});
        return {
            output: result,
            cost: 0
        };
    }
}
exports.HuggingFace = HuggingFace;
