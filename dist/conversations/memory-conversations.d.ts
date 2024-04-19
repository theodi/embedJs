import { Conversation, ConversationHistory } from '../global/types.js';
import { BaseConversations } from '../interfaces/base-conversations.js';
declare class InMemoryConversations implements BaseConversations {
    private conversations;
    init(): Promise<void>;
    addConversation(conversationId: string): Promise<void>;
    getConversation(conversationId: string): Promise<Conversation>;
    hasConversation(conversationId: string): Promise<boolean>;
    deleteConversation(conversationId: string): Promise<void>;
    addEntryToConversation(conversationId: string, entry: ConversationHistory): Promise<void>;
    clearConversations(): Promise<void>;
}
export { InMemoryConversations };
