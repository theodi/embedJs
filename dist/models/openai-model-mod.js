import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { encodingForModel } from "js-tiktoken";
import { BaseModel } from '../interfaces/base-model.js';
import { getModelNameForTiktoken } from '@langchain/core/language_models/base';
export class OpenAiMod extends BaseModel {
    constructor(temperature, modelName) {
        super(temperature);
        Object.defineProperty(this, "debug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:BaseModel')
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
        this.model = new ChatOpenAI({ temperature, modelName });
        this.modelName = modelName;
    }
    getNumTokens(message) {
        const encoder = encodingForModel(getModelNameForTiktoken(this.modelName));
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
        const pastMessages = [new SystemMessage(system)];
        var message = `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}
###
${userQuery}`;
        pastMessages.push(new HumanMessage(message));
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
