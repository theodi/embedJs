import createDebugMessages from 'debug';
import { v4 as uuidv4 } from 'uuid';
import { Chunk, EntryMessage } from '../global/types.js';
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

        const uniqueSources = this.extractUniqueSources(supportingContext);

        // Extract only the content from each entry in the conversation
        const pastConversations = conversation.entries.map(entry => entry.content);

        const result = await this.runQuery(system, userQuery, supportingContext, pastConversations);

        // Add user query to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            _id: uuidv4(),
            timestamp: new Date(),
            content: {
                sender: 'HUMAN',
                message: userQuery
            },
            sources: []
        });

        // Add AI response to history
        await BaseModel.conversations.addEntryToConversation(conversationId, {
            _id: uuidv4(),
            timestamp: new Date(),
            content: {
                sender: 'AI',
                message: result.output
            },
            sources: uniqueSources
        });

        return result;
    }

    private extractUniqueSources(supportingContext: Chunk[]): string[] {
        const sourceSet = new Set<string>();  // Create a Set to hold unique sources

        supportingContext.forEach(item => {
            if (item.metadata && item.metadata.source) {
                sourceSet.add(item.metadata.source);  // Add source to Set
            }
        });

        return Array.from(sourceSet);  // Convert Set to Array to return
    }

    protected abstract runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: EntryMessage[],
    ): Promise<any>;
}