/// <reference types="node" />
import { Client } from '../core/client';
import { URL } from 'url';
export declare class BaseClass {
    /** @hidden */
    static parseDate<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? Date : (Date | null);
    /** @hidden */
    static parseString<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? string : (string | null);
    /** @hidden */
    static parseNumber<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? number : (number | null);
    /** @hidden */
    static parseURL<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? URL : (URL | null);
    readonly client: Client;
    constructor(client: Client);
}
export declare class BaseResource extends BaseClass {
    readonly ID: number;
    readonly URL: URL;
    constructor(client: Client, data: any);
}
