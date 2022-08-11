import { Client } from '../core/client';
import { BaseResource } from './base';
import { ContentTitle, ContentImage, TitleArray } from './content/base';
import { Link } from './misc';
export declare class Producer extends BaseResource {
    constructor(client: Client, data: any);
    readonly title: ContentTitle;
    readonly titles: TitleArray;
    readonly image: ContentImage;
    readonly favorites: number;
    readonly established: Date;
    getFull(): Promise<ProducerFull>;
    getExternal(): Promise<Link[]>;
}
export declare class ProducerFull extends Producer {
    constructor(client: Client, data: any);
    readonly external: Array<Link>;
}
