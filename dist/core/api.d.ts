/// <reference types="node" />
import { Client } from '../core/client';
import { URL } from 'url';
import HTTP from 'http';
import HTTPS from 'https';
import { CacheManager } from './cache';
export interface APIRequestQuery {
    disableCaching?: any;
    [key: string]: string | undefined;
}
export declare class APIResponseData {
    private static parsePagination;
    readonly data?: any;
    readonly date: number;
    readonly status: number;
    readonly headers: HTTP.IncomingHttpHeaders;
    readonly pagination?: {
        current: number;
        last: number;
        hasNext: boolean;
    };
    constructor(status: number | undefined, url: URL, headers: HTTP.IncomingHttpHeaders, data: any);
}
export interface APIRequestQueueEntry {
    url: URL;
    resolve: (data: APIResponseData) => void;
    reject: (error: Error) => void;
}
export declare class APIRequestQueue extends Array<APIRequestQueueEntry> {
    readonly APIClient: APIClient;
    readonly client: Client;
    isRunning: boolean;
    lastRequest: number;
    warningEmitted: boolean;
    get nextRequest(): number;
    private debug;
    runQueue(): Promise<void>;
    push(queueEntry: APIRequestQueueEntry): number;
    constructor(APIClient: APIClient);
}
export declare class APIError extends Error {
    readonly status: number;
    readonly errorType: string;
    readonly error: string;
    readonly trace: string;
    readonly reportURL: string;
    readonly referenceURL: string;
    constructor(message: string, referenceURL: string, response: APIResponseData);
}
export declare class APIClient {
    readonly cacheManager: CacheManager;
    parseURL(path: string, query?: APIRequestQuery): URL;
    readonly client: Client;
    readonly queue: APIRequestQueue;
    readonly agent: {
        http: HTTP.Agent;
        https: HTTPS.Agent;
    };
    private debug;
    request(path: string, query?: APIRequestQuery): Promise<APIResponseData>;
    isCachingEnabled(url: URL): boolean;
    executeRequest(url: URL): Promise<APIResponseData>;
    constructor(client: Client);
}
