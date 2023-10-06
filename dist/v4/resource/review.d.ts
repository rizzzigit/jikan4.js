import { Client } from "../core/client";
import { AnimeReview } from "./content/anime";
import { MangaReview } from "./content/manga";
import { AnimeMeta, MangaMeta } from "./meta";
export declare class ReviewAnime extends AnimeReview {
    readonly entry: AnimeMeta;
    constructor(client: Client, data: any);
}
export declare class ReviewManga extends MangaReview {
    readonly entry: MangaMeta;
    constructor(client: Client, data: any);
}
