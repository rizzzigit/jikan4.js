import { BaseManager } from './base';
import { ContentRelationType } from '../resource/content/base';
import { Manga, MangaCharacterReference, MangaNews, MangaTopic, MangaStatistics, MangaUserUpdate, MangaReview, MangaRelationGroup } from '../resource/content/manga';
import { Image } from '../resource/misc';
import { MangaGenreMeta, MagazineMeta, GenreType } from '../resource/meta';
export interface MangaSearchFilter {
    type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua';
    score: number;
    minScore: number;
    maxScore: number;
    status: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming';
    sfw: boolean;
    genres: Array<number | MangaGenreMeta<GenreType>>;
    excludeGenres: Array<number | MangaGenreMeta<GenreType>>;
    magazines: Array<number | MagazineMeta>;
    orderBy: 'mal_id' | 'title' | 'start_date' | 'end_date' | 'chapters' | 'volumes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
    sort: 'desc' | 'asc';
}
export declare class MangaManager extends BaseManager {
    /** @hidden */
    storeCache(body: any): any;
    search(searchString: string, filter?: Partial<MangaSearchFilter>, offset?: number, maxCount?: number): Promise<Manga[]>;
    list(offset?: number, maxCount?: number): Promise<Manga[]>;
    listTop(offset?: number, maxCount?: number): Promise<Manga[]>;
    listRecommended(offset?: number, maxCount?: number): Promise<Manga[]>;
    random(): Promise<Manga>;
    get(mangaId: number): Promise<Manga | undefined>;
    getCharacters(mangaId: number): Promise<Array<MangaCharacterReference> | undefined>;
    getNews(mangaId: number, offset?: number, maxCount?: number): Promise<Array<MangaNews> | undefined>;
    getTopics(mangaId: number): Promise<Array<MangaTopic> | undefined>;
    getPictures(mangaId: number): Promise<Array<Image> | undefined>;
    getStatistics(mangaId: number): Promise<MangaStatistics | undefined>;
    getMoreInfo(mangaId: number): Promise<string | null | undefined>;
    getUserUpdates(mangaId: number): Promise<Array<MangaUserUpdate> | undefined>;
    getReviews(mangaId: number): Promise<Array<MangaReview> | undefined>;
    getRelations(mangaId: number): Promise<Array<MangaRelationGroup<ContentRelationType>> | undefined>;
}
