import { TopAnimeReview, TopMangaReview } from '../resource/top';
import { BaseManager } from './base';
export declare class TopManager extends BaseManager {
    listAnime(offset?: number, maxCount?: number): Promise<import("..").Anime[]>;
    listManga(offset?: number, maxCount?: number): Promise<import("..").Manga[]>;
    listPeople(offset?: number, maxCount?: number): Promise<import("..").Person[]>;
    listCharacters(offset?: number, maxCount?: number): Promise<import("..").Character[]>;
    listReviews(offset?: number, maxCount?: number): Promise<(TopAnimeReview | TopMangaReview)[]>;
}
