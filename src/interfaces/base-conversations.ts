// base-conversations.ts
import { Conversation, ConversationHistory } from '../global/types.js';

export interface BaseConversations {
    init(): Promise<void>;
    addConversation(conversationId: string): Promise<void>;
    getConversation(conversationId: string): Promise<Conversation>;
    hasConversation(conversationId: string): Promise<boolean>;
    deleteConversation(conversationId: string): Promise<void>;
    addEntryToConversation(conversationId: string, entry: ConversationHistory): Promise<void>;
    clearConversations(): Promise<void>;
}