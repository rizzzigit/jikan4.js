import { Client } from '../core/client';
import { BaseResource } from './base';
import { ContentTitle, TitleArray } from './content/base';
import { ImageFormatCollection, Link } from './misc';
export declare class Producer extends BaseResource {
    constructor(client: Client, data: any);
    readonly title: ContentTitle;
    readonly titles: TitleArray;
    readonly image: ImageFormatCollection;
    readonly favorites: number;
    readonly established: Date | null;
    readonly about: string | null;
    readonly count: number;
    getFull(): Promise<ProducerFull>;
    getExternal(): Promise<Link[]>;
}
export declare class ProducerFull extends Producer {
    constructor(client: Client, data: any);
    readonly external: Array<Link>;
}
