export type LoaderMetadata<T> = T & { source: string };
export type LoaderChunk<
    Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
    pageContent: string;
    contentHash: string;
    metadata: LoaderMetadata<Meta>;
};

export type Metadata<T> = T & { id: string; uniqueLoaderId: string; source: string };
export type Chunk<Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>> =
    {
        pageContent: string;
        metadata: Metadata<Meta>;
    };

export type EmbeddedChunk<
    Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
    vector: number[];
    pageContent: string;
    metadata: Metadata<Meta>;
};

export type AddLoaderReturn = { entriesAdded: number; uniqueId: string };

export type EntryMessage = {
    sender: 'HUMAN' | 'AI';
    message: string
}

export type Conversation = {
    conversationId: string;
    entries: ConversationEntry[];
}

export type ConversationEntry = {
    _id: string;
    timestamp: Date;
    content: EntryMessage;
    sources: Sources[]
}

export type Sources = {
    source: string;
    loaderId: string
}