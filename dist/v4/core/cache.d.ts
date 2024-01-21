import { Client } from './client';
import { APIRequestData, APIResponseData } from './api';
export declare class CacheManager {
    #private;
    readonly client: Client;
    /** @hidden */
    private fs;
    /** @hidden */
    private get cacheDir();
    /** @hidden */
    private file;
    /** @hidden */
    private isExpired;
    get(requestData: APIRequestData): Promise<APIResponseData | undefined>;
    set(requestData: APIRequestData, rawData: APIResponseData): Promise<APIResponseData>;
    has(requestData: APIRequestData): Promise<boolean>;
    delete(requestData: APIRequestData): Promise<void>;
    default(requestData: APIRequestData, rawData: any): Promise<void>;
    constructor(client: Client);
}
