import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, EntryMessage } from '../global/types.js';
export declare class HuggingFace extends BaseModel {
    private readonly debug;
    private readonly modelName;
    private readonly maxNewTokens;
    private readonly endpointUrl?;
    private model;
    constructor(params?: {
        modelName?: string;
        temperature?: number;
        maxNewTokens?: number;
        endpointUrl?: string;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: EntryMessage[]): Promise<any>;
}
