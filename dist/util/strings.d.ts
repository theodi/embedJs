import { EntryMessage } from '../global/types.js';
export declare function truncateCenterString(fullStr: string, strLen: number, separator?: string): string;
export declare function cleanString(text: string): string;
export declare function stringFormat(template: string, ...args: any[]): string;
export declare function historyToString(history: EntryMessage[]): string;
export declare function toTitleCase(str: string): string;
export declare function isValidURL(url: string): boolean;
export declare function isValidJson(str: string): boolean;
