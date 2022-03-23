import { TopAnimeReview, TopMangaReview } from '../resource/top';
import { TopAnimeFilter } from './anime';
import { BaseManager } from './base';
import { TopMangaFilter } from './manga';
export declare class TopManager extends BaseManager {
    listAnime(filter?: Partial<TopAnimeFilter>, offset?: number, maxCount?: number): Promise<import("..").Anime[]>;
    listManga(filter?: Partial<TopMangaFilter>, offset?: number, maxCount?: number): Promise<import("..").Manga[]>;
    listPeople(offset?: number, maxCount?: number): Promise<import("..").Person[]>;
    listCharacters(offset?: number, maxCount?: number): Promise<import("..").Character[]>;
    listReviews(offset?: number, maxCount?: number): Promise<(TopAnimeReview | TopMangaReview)[]>;
}
