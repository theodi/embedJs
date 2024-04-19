import createDebugMessages from 'debug';
import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseConversations } from './base-conversations.js';

export abstract class BaseModel {
    private static defaultTemperature: number;
    private static conversations: BaseConversations; // Static property for managing conversations

    private readonly baseDebug = createDebugMessages('embedjs:model:BaseModel');
    private readonly _temperature?: number;

    constructor(temperature?: number) {
        this._temperature = temperature;
    }

    public static setDefaultTemperature(temperature?: number) {
        BaseModel.defaultTemperature = temperature;
    }

    public static setConversations(conversations: BaseConversations) {
        BaseModel.conversations = conversations; // Correct setting of the static property
    }

    public get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }

    public async init(): Promise<void> {}

    public async query(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        conversationId: string = 'default',
    ): Promise<any> {
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

    protected abstract runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any>;
}