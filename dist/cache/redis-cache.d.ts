import { RedisOptions } from 'ioredis';
import { BaseCache } from '../interfaces/base-cache.js';
export declare class RedisCache implements BaseCache {
    private readonly options;
    private redis;
    constructor(options: RedisOptions);
    init(): Promise<void>;
    addLoader(loaderId: string, chunkCount: number): Promise<void>;
    getLoader(loaderId: string): Promise<{
        chunkCount: number;
    } | null>;
    hasLoader(loaderId: string): Promise<boolean>;
    loaderCustomSet<T extends Record<string, unknown>>(loaderCombinedId: string, value: T): Promise<void>;
    loaderCustomGet<T extends Record<string, unknown>>(loaderCombinedId: string): Promise<T>;
    loaderCustomHas(loaderCombinedId: string): Promise<boolean>;
    deleteLoader(loaderId: string): Promise<void>;
    loaderCustomDelete(loaderCombinedId: string): Promise<void>;
}
