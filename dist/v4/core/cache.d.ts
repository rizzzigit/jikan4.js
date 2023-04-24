import { Client } from './client';
import { APIRequestData, APIResponseData } from './api';
export declare class CacheManager {
    readonly client: Client;
    /** @hidden */
    private get cacheDir();
    /** @hidden */
    private file;
    /** @hidden */
    private isExpired;
    get(requestData: APIRequestData): APIResponseData | undefined;
    set(requestData: APIRequestData, rawData: APIResponseData): APIResponseData;
    has(requestData: APIRequestData): boolean;
    delete(requestData: APIRequestData): void;
    default(requestData: APIRequestData, rawData: any): any;
    constructor(client: Client);
}
