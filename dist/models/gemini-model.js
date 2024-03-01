import createDebugMessages from 'debug';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { BaseModel } from '../interfaces/base-model.js';
export class Gemini extends BaseModel {
    constructor({ temperature, modelName }) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:GeminiPro')
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
        this.model = new ChatGoogleGenerativeAI({
            modelName: this.modelName,
            maxOutputTokens: 4096,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
                },
            ],
        });
    }
    async runQuery(system, userQuery, supportingContext, pastConversations) {
        const pastMessages = [new SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new HumanMessage(message));
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
