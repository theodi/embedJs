import { BaseCache } from '../interfaces/base-cache.js';
export declare class MongoCache implements BaseCache {
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
    addLoader(loaderId: string, chunkCount: number): Promise<void>;
    getLoader(loaderId: string): Promise<{
        chunkCount: number;
    }>;
    hasLoader(loaderId: string): Promise<boolean>;
    loaderCustomSet<T extends Record<string, unknown>>(loaderCombinedId: string, value: T): Promise<void>;
    loaderCustomGet<T extends Record<string, unknown>>(loaderCombinedId: string): Promise<T>;
    loaderCustomHas(loaderCombinedId: string): Promise<boolean>;
    clear(): Promise<void>;
    deleteLoader(loaderId: string): Promise<void>;
    loaderCustomDelete(loaderCombinedId: string): Promise<void>;
    close(): Promise<void>;
}
