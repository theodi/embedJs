import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseConversations } from './base-conversations.js';
export declare abstract class BaseModel {
    private static defaultTemperature;
    private static conversations;
    private readonly baseDebug;
    private readonly _temperature?;
    constructor(temperature?: number);
    static setDefaultTemperature(temperature?: number): void;
    static setConversations(conversations: BaseConversations): void;
    get temperature(): number;
    init(): Promise<void>;
    query(system: string, userQuery: string, supportingContext: Chunk[], conversationId?: string): Promise<any>;
    protected abstract runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any>;
}
