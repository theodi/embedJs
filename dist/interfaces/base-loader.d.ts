/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from 'node:events';
import { LoaderChunk } from '../global/types.js';
import { BaseCache } from './base-cache.js';
export declare abstract class BaseLoader<T extends Record<string, string | number | boolean> = Record<string, string | number | boolean>, M extends Record<string, unknown> = Record<string, null>> extends EventEmitter {
    private static cache?;
    static setCache(cache?: BaseCache): void;
    protected readonly uniqueId: string;
    private readonly _canIncrementallyLoad;
    constructor(uniqueId: string, canIncrementallyLoad?: boolean);
    init(): Promise<void>;
    get canIncrementallyLoad(): boolean;
    getUniqueId(): string;
    private getCustomCacheKey;
    protected checkInCache(key: string): Promise<boolean>;
    protected getFromCache(key: string): Promise<Record<string, unknown>>;
    protected saveToCache(key: string, value: M): Promise<void>;
    protected deleteFromCache(key: string): Promise<false | void>;
    protected loadIncrementalChunk(incrementalGenerator: AsyncGenerator<LoaderChunk<T>, void, void>): Promise<void>;
    abstract getChunks(): AsyncGenerator<LoaderChunk<T>, void, void>;
}
