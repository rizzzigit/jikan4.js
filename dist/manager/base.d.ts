import { Client } from '../core/client';
import { BaseClass } from '../resource/base';
import { APIClient, APIRequestQuery } from '../core/api';
export declare class BaseManager extends BaseClass {
    protected APIClient: APIClient;
    /** @hidden */
    private debug;
    /** @hidden */
    protected requestResource(path: string, query?: APIRequestQuery): Promise<any>;
    /** @hidden */
    protected requestPaginatedResource(path: string, offset?: number, maxCount?: number, query?: APIRequestQuery): Promise<any[] | undefined>;
    /** @hidden */
    storeCache(path: string, data: any, query?: APIRequestQuery): any;
    constructor(client: Client);
}
