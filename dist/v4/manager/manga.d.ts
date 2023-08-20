import { BaseManager } from './base';
import { ContentExternal, ContentNews, ContentRelationType } from '../resource/content/base';
import { Manga, MangaCharacterReference, MangaTopic, MangaStatistics, MangaUserUpdate, MangaReview, MangaRelationGroup, MangaFull } from '../resource/content/manga';
import { ImageFormatCollection } from '../resource/misc';
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
export interface TopMangaFilter {
    type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua';
    filter: 'publishing' | 'upcoming' | 'bypopularity' | 'favorite';
}
export declare class MangaManager extends BaseManager {
    search(searchString: string, filter?: Partial<MangaSearchFilter>, offset?: number, maxCount?: number): Promise<Manga[]>;
    list(offset?: number, maxCount?: number): Promise<Manga[]>;
    listTop(filter?: Partial<TopMangaFilter>, offset?: number, maxCount?: number): Promise<Manga[]>;
    listRecommended(offset?: number, maxCount?: number): Promise<Manga[]>;
    random(sfw?: boolean): Promise<Manga>;
    get(mangaId: number): Promise<Manga | undefined>;
    getFull(mangaId: number): Promise<MangaFull | undefined>;
    getCharacters(mangaId: number): Promise<Array<MangaCharacterReference> | undefined>;
    getNews(mangaId: number, offset?: number, maxCount?: number): Promise<Array<ContentNews> | undefined>;
    getTopics(mangaId: number): Promise<Array<MangaTopic> | undefined>;
    getPictures(mangaId: number): Promise<Array<ImageFormatCollection> | undefined>;
    getStatistics(mangaId: number): Promise<MangaStatistics | undefined>;
    getMoreInfo(mangaId: number): Promise<string | null | undefined>;
    getUserUpdates(mangaId: number): Promise<Array<MangaUserUpdate> | undefined>;
    getReviews(mangaId: number): Promise<Array<MangaReview> | undefined>;
    getRelations(mangaId: number): Promise<Array<MangaRelationGroup<ContentRelationType>> | undefined>;
    getExternal(mangaId: number): Promise<Array<ContentExternal> | undefined>;
}
