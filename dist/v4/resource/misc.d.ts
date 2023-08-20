import { BaseClass } from './base';
import { Client } from '../core/client';
export declare class Image extends BaseClass {
    readonly small: URL | null;
    readonly default: URL | null;
    readonly medium: URL | null;
    readonly large: URL | null;
    readonly maximum: URL | null;
    getOrFallback(sizes: Array<'small' | 'default' | 'medium' | 'large' | 'maximum'>): URL | null;
    constructor(client: Client, data: any);
}
export declare class ImageFormatCollection extends BaseClass {
    readonly jpg: Image | null;
    readonly webp: Image | null;
    getOrFallback(formats: Array<'jpg' | 'webp'>, sizes: Parameters<Image['getOrFallback']>[0]): URL | null;
    getOrFallback(formats: Array<'jpg' | 'webp'>): Image | null;
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
