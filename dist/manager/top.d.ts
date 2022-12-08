import { Anime, Manga } from '../Jikan';
import { TopAnimeFilter } from './anime';
import { BaseManager } from './base';
import { TopMangaFilter } from './manga';
export declare class TopManager extends BaseManager {
    listAnime(filter?: Partial<TopAnimeFilter>, offset?: number, maxCount?: number): Promise<Anime[]>;
    listManga(filter?: Partial<TopMangaFilter>, offset?: number, maxCount?: number): Promise<Manga[]>;
    listPeople(offset?: number, maxCount?: number): Promise<import("../Jikan").Person[]>;
    listCharacters(offset?: number, maxCount?: number): Promise<import("../Jikan").Character[]>;
    listReviews(offset?: number, maxCount?: number): Promise<(import("../Jikan").TopMangaReview | import("../Jikan").TopAnimeReview)[]>;
}
