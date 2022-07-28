/// <reference types="node" />
import { URL } from 'url';
import { Client } from '../core/client';
import { BaseResource } from './base';
import { ContentTitle, ContentImage } from './content/base';
export declare class Producer extends BaseResource {
    constructor(client: Client, data: any);
    readonly title: ContentTitle;
    readonly image: ContentImage;
    readonly favorites: number;
    readonly established: Date;
    getFull(): Promise<ProducerFull>;
    getExternal(): Promise<{
        name: string;
        url: URL;
    }[]>;
}
export declare class ProducerFull extends Producer {
    constructor(client: Client, data: any);
    readonly external: Array<{
        name: string;
        url: URL;
    }>;
}
