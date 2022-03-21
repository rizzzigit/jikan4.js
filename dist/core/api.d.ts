/// <reference types="node" />
import HTTP from 'http';
import HTTPS from 'https';
import { Client } from '../core/client';
import { URL } from 'url';
import { CacheManager } from './cache';
export interface APIRequestQuery {
    [key: string]: string | undefined;
}
export interface APIRequestData {
    path: string;
    query?: APIRequestQuery;
    cache?: boolean;
}
export declare class APIResponseData {
    private static parsePagination;
    constructor(status: number, url: URL, headers: HTTP.IncomingHttpHeaders, body: any);
    readonly url: string;
    readonly status: number;
    readonly body: any;
    readonly time: number;
    readonly headers: HTTP.IncomingHttpHeaders;
    readonly pagination?: {
        current: number;
        last: number;
        hasNext: boolean;
    };
}
export declare class APIError extends Error {
    constructor(response: APIResponseData);
    readonly status: number;
    readonly errorType: string;
    readonly error: string;
    readonly trace: string;
    readonly reportUrl: string;
    readonly referenceUrl: string;
    readonly response: APIResponseData;
}
export declare class APIClient {
    constructor(client: Client);
    readonly client: Client;
    readonly queue: Array<{
        requestData: APIRequestData;
        resolve: (data: APIResponseData) => void;
        reject: (error: Error | APIError) => void;
    }>;
    readonly cache?: CacheManager;
    readonly agent: {
        http: HTTP.Agent;
        https: HTTPS.Agent;
    };
    /** @hidden */
    private newRequestInstance;
    /** @hidden */
    private lastRequest;
    /** @hidden */
    private get nextRequest();
    /** @hidden */
    private awaitNextRequest;
    /** @hidden */
    private isQueueRunning;
    /** @hidden */
    private runQueue;
    /** @hidden */
    private addQueue;
    /** @hidden */
    private debug;
    constructURL(requestData: APIRequestData): URL;
    request(requestData: APIRequestData): Promise<APIResponseData>;
    /** @hidden */
    private execReqeust;
}
