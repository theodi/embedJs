import { Conversation, ConversationEntry } from '../global/types.js';
import { BaseConversations } from '../interfaces/base-conversations.js';
export declare class MongoConversations implements BaseConversations {
    private readonly uri;
    private readonly dbName;
    private readonly collectionName;
    private client;
    constructor({ uri, dbName, collectionName }: {
        uri: string;
        dbName: string;
        collectionName: string;
    });
    init(): Promise<void>;
    addConversation(conversationId: string): Promise<void>;
    getConversation(conversationId: string): Promise<Conversation>;
    hasConversation(conversationId: string): Promise<boolean>;
    deleteConversation(conversationId: string): Promise<void>;
    addEntryToConversation(conversationId: string, entry: ConversationEntry): Promise<void>;
    clearConversations(): Promise<void>;
    close(): Promise<void>;
}
