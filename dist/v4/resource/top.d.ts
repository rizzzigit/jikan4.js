import { MangaReview } from './content/manga';
import { AnimeReview } from './content/anime';
import { Client } from '../core/client';
import { AnimeMeta, MangaMeta } from './meta';
export declare class TopAnimeReview extends AnimeReview {
    readonly anime: AnimeMeta;
    constructor(client: Client, data: any);
}
export declare class TopMangaReview extends MangaReview {
    readonly manga: MangaMeta;
    constructor(client: Client, data: any);
}
