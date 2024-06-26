import createDebugMessages from 'debug';
import { v4 as uuidv4 } from 'uuid';
export class BaseModel {
    constructor(temperature) {
        Object.defineProperty(this, "baseDebug", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: createDebugMessages('embedjs:model:BaseModel')
        });
        Object.defineProperty(this, "_temperature", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._temperature = temperature;
    }
    static setDefaultTemperature(temperature) {
        BaseModel.defaultTemperature = temperature;
    }
    static setConversations(conversations) {
        BaseModel.conversations = conversations; // Correct setting of the static property
    }
    get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }
    async init() { }
    async query(system, userQuery, supportingContext, conversationId = 'default') {
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
        const newEntry = {
            _id: uuidv4(),
            timestamp: new Date(),
            content: {
                sender: "AI",
                message: result.output
            },
            sources: uniqueSources
        };
        // Add AI response to history
        await BaseModel.conversations.addEntryToConversation(conversationId, newEntry);
        return newEntry;
    }
    extractUniqueSources(supportingContext) {
        const uniqueSources = new Map(); // Use a Map to track unique sources by URL
        supportingContext.forEach(item => {
            const { metadata } = item;
            if (metadata && metadata.source) {
                // Use the source URL as the key to ensure uniqueness
                if (!uniqueSources.has(metadata.source)) {
                    uniqueSources.set(metadata.source, {
                        source: metadata.source,
                        loaderId: metadata.uniqueLoaderId // Assuming this field always exists
                    });
                }
            }
        });
        // Convert the values of the Map to an array
        return Array.from(uniqueSources.values());
    }
}
