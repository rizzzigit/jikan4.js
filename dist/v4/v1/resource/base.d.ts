import { Client } from '../core/client';
export declare class BaseClass {
    static parseDate<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? Date : (Date | null);
    static parseURL<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? URL : (URL | null);
    readonly client: Client;
    constructor(client: Client);
}
export declare class BaseResource extends BaseClass {
    readonly id: number;
    readonly url: URL;
    constructor(client: Client, data: any);
}
