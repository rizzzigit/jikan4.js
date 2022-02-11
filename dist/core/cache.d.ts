/// <reference types="node" />
import { Client } from './client';
import { URL } from 'url';
export declare class CacheManager {
    readonly client: Client;
    /** @hidden */
    private get cacheDir();
    /** @hidden */
    private file;
    /** @hidden */
    private isExpired;
    get(url: URL): any;
    set(url: URL, rawData: any): any;
    has(url: URL): boolean;
    delete(url: URL): void;
    default(url: URL, rawData: any): any;
    constructor(client: Client);
}
