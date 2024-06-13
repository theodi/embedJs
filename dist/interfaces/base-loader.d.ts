/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from 'node:events';
import { LoaderChunk, LoaderList, UnfilteredLoaderChunk } from '../global/types.js';
import { BaseCache } from './base-cache.js';
export declare abstract class BaseLoader<T extends Record<string, string | number | boolean> = Record<string, string | number | boolean>, M extends Record<string, unknown> = Record<string, null>> extends EventEmitter {
    private static cache?;
    private static readonly LOADERS_LIST_CACHE_KEY;
    static setCache(cache?: BaseCache): void;
    private static recordLoaderInCache;
    static getLoadersList(): Promise<LoaderList>;
    protected readonly uniqueId: string;
    private readonly _canIncrementallyLoad;
    protected readonly chunkOverlap: number;
    protected readonly chunkSize: number;
    constructor(uniqueId: string, loaderMetadata: Record<string, unknown>, chunkSize?: number, chunkOverlap?: number, canIncrementallyLoad?: boolean);
    init(): Promise<void>;
    get canIncrementallyLoad(): boolean;
    getUniqueId(): string;
    private getCustomCacheKey;
    protected checkInCache(key: string): Promise<boolean>;
    protected getFromCache(key: string): Promise<Record<string, unknown>>;
    protected saveToCache(key: string, value: M): Promise<void>;
    protected deleteFromCache(key: string): Promise<false | void>;
    protected loadIncrementalChunk(incrementalGenerator: AsyncGenerator<LoaderChunk<T>, void, void>): Promise<void>;
    /**
     * This TypeScript function asynchronously processes chunks of data, cleans up the content,
     * calculates a content hash, and yields the modified chunks.
     */
    getChunks(): AsyncGenerator<LoaderChunk<T>, void, void>;
    abstract getUnfilteredChunks(): AsyncGenerator<UnfilteredLoaderChunk<T>, void, void>;
}
