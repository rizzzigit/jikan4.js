import { BaseManager } from './base';
import { ContentRelationType } from '../resource/content/base';
import { Manga, MangaCharacterReference, MangaNews, MangaTopic, MangaStatistics, MangaUserUpdate, MangaReview, MangaRelationGroup } from '../resource/content/manga';
import { Image } from '../resource/misc';
import { MangaGenreMeta, MagazineMeta } from '../resource/meta';
export interface MangaSearchFilter {
    type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua';
    score: number;
    minScore: number;
    maxScore: number;
    status: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming';
    sfw: boolean;
    genres: Array<number | MangaGenreMeta>;
    excludeGenres: Array<number | MangaGenreMeta>;
    magazines: Array<number | MagazineMeta>;
    orderBy: 'mal_id' | 'title' | 'start_date' | 'end_date' | 'chapters' | 'volumes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
    sort: 'desc' | 'asc';
}
export declare class MangaManager extends BaseManager {
    /** @hidden */
    storeCache(data: any): any;
    search(searchString: string, filter?: Partial<MangaSearchFilter>, offset?: number, maxCount?: number): Promise<Manga[]>;
    list(offset?: number, maxCount?: number): Promise<Manga[]>;
    listTop(offset?: number, maxCount?: number): Promise<Manga[]>;
    listRecommended(offset?: number, maxCount?: number): Promise<Manga[]>;
    random(): Promise<Manga>;
    get(mangaID: number): Promise<Manga | undefined>;
    getCharacters(mangaID: number): Promise<Array<MangaCharacterReference> | undefined>;
    getNews(mangaID: number, offset?: number, maxCount?: number): Promise<Array<MangaNews> | undefined>;
    getTopics(mangaID: number): Promise<Array<MangaTopic> | undefined>;
    getPictures(mangaID: number): Promise<Array<Image> | undefined>;
    getStatistics(mangaID: number): Promise<MangaStatistics | undefined>;
    getMoreInfo(mangaID: number): Promise<string | null | undefined>;
    getUserUpdates(mangaID: number): Promise<Array<MangaUserUpdate> | undefined>;
    getReviews(mangaID: number): Promise<Array<MangaReview> | undefined>;
    getRelations(mangaID: number): Promise<Array<MangaRelationGroup<ContentRelationType>> | undefined>;
}
