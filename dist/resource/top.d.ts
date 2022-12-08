import { MangaReview } from './content/manga';
import { Client } from '../core/client';
import { MangaMeta } from './meta';
export declare class TopMangaReview extends MangaReview {
    readonly manga: MangaMeta;
    constructor(client: Client, data: any);
}
