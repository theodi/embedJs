import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
export declare class OpenAiMod extends BaseModel {
    private readonly debug;
    private readonly model;
    private readonly modelName;
    constructor(temperature: number, modelName: string);
    getNumTokens(message: any): number;
    getTokenCost(messages: any, output: any): number;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
}
