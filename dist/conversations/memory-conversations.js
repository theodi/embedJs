class InMemoryConversations {
    constructor() {
        Object.defineProperty(this, "conversations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    async init() {
        this.conversations.clear();
    }
    async addConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            this.conversations.set(conversationId, { conversationId, entries: [] });
        }
    }
    async getConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            // Automatically create a new conversation if it does not exist
            this.conversations.set(conversationId, { conversationId, entries: [] });
        }
        return this.conversations.get(conversationId);
    }
    async hasConversation(conversationId) {
        return this.conversations.has(conversationId);
    }
    async deleteConversation(conversationId) {
        this.conversations.delete(conversationId);
    }
    async addEntryToConversation(conversationId, entry) {
        const conversation = await this.getConversation(conversationId);
        conversation.entries.push(entry);
    }
    async clearConversations() {
        this.conversations.clear();
    }
}
export { InMemoryConversations };
