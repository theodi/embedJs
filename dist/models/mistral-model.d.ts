import { Chunk, EntryMessage } from '../global/types.js';
import { BaseModel } from '../interfaces/base-model.js';
export declare class Mistral extends BaseModel {
    private readonly debug;
    private model;
    constructor({ temperature, accessToken, modelName, }: {
        temperature?: number;
        accessToken: string;
        modelName?: string;
    });
    runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: EntryMessage[]): Promise<any>;
}
