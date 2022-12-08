import { Client } from '../core/client';
import { Image, YoutubeVideo } from './misc';
export declare class BaseClass {
    /** @hidden */
    static parseImage(data: any): Image;
    /** @hidden */
    static parseYoutubeVideo(data: any): YoutubeVideo;
    /** @hidden */
    static parseDate<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? Date : (Date | null);
    /** @hidden */
    static parseURL<IsNullable extends boolean = false>(input: any, nullable?: IsNullable): IsNullable extends false ? string : (string | null);
    readonly client: Client;
    constructor(client: Client);
}
export declare class BaseResource extends BaseClass {
    readonly id: number;
    readonly url: string;
    constructor(client: Client, data: any);
}
