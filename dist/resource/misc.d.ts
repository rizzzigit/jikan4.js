import { BaseClass } from './base';
import { Client } from '../core/client';
export declare class Image extends BaseClass {
    readonly small: URL | null;
    readonly default: URL | null;
    readonly medium: URL | null;
    readonly large: URL | null;
    readonly maximum: URL | null;
    constructor(client: Client, data: any);
}
export declare class YoutubeVideo extends BaseClass {
    readonly id: string;
    readonly url: URL;
    readonly embedUrl: URL;
    readonly image: Image;
    constructor(client: Client, data: any);
}
export interface Link {
    name: string;
    url: URL;
}
