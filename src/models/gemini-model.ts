import createDebugMessages from 'debug';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';

export class Gemini extends BaseModel {
    private readonly debug = createDebugMessages('embedjs:model:GeminiPro');
    private readonly modelName: string;
    private model: ChatGoogleGenerativeAI;

    constructor({ temperature, modelName }: { temperature?: number; modelName: string }) {
        super(temperature);
        this.modelName = modelName ? modelName : 'gemini-pro';
    }

    override async init(): Promise<void> {
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

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [new SystemMessage(system)];
        
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
