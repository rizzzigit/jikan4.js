import { Client } from '../core/client';
import { BaseClass } from '../resource/base';
import { APIClient, APIRequestQuery, APIRequestData } from '../core/api';
export interface Result<Paginated extends boolean = false> {
    path: string;
    query: APIRequestQuery;
    data: Paginated extends true ? Array<any> : any;
}
export declare class BaseManager extends BaseClass {
    protected APIClient: APIClient;
    /** @hidden */
    private debug;
    /** @hidden */
    protected request(path: string, query?: APIRequestQuery): Promise<any>;
    /** @hidden */
    protected requestPaginated(path: string, offset?: number, maxCount?: number, query?: APIRequestQuery): Promise<any[] | undefined>;
    /** @hidden */
    storeCache(requestData: APIRequestData, body: any): any;
    constructor(client: Client);
}
