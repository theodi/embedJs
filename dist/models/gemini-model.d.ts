import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, EntryMessage } from '../global/types.js';
export declare class Gemini extends BaseModel {
    private readonly debug;
    private readonly modelName;
    private model;
    constructor({ temperature, modelName }: {
        temperature?: number;
        modelName: string;
    });
    init(): Promise<void>;
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: EntryMessage[]): Promise<any>;
}
