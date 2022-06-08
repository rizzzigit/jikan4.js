import { BaseManager } from '../manager/base';
import { ContentExternal, ContentNews, ContentRelationType } from '../resource/content/base';
import { Anime, AnimeCharacterReference, AnimeStaffReference, AnimePartialEpisode, AnimeEpisode, AnimeTopic, AnimeVideo, AnimeStatistics, AnimeRecommendation, AnimeUserUpdate, AnimeReview, AnimeRelationGroup, AnimeFull } from '../resource/content/anime';
import { Image } from '../resource/misc';
import { AnimeGenreMeta, ProducerMeta, GenreType } from '../resource/meta';
export interface AnimeSearchFilter {
    type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
    score: number;
    minScore: number;
    maxScore: number;
    scoredBy: number;
    status: 'airing' | 'complete' | 'upcoming';
    rating: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
    sfw: boolean;
    genres: Array<number | AnimeGenreMeta<GenreType>>;
    excludeGenres: Array<number | AnimeGenreMeta<GenreType>>;
    producers: Array<number | ProducerMeta>;
    orderBy: 'mal_id' | 'title' | 'type' | 'rating' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
    sort: 'desc' | 'asc';
}
export interface TopAnimeFilter {
    type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
    filter: 'publishing' | 'upcoming' | 'bypopularity' | 'favorite';
}
export declare class AnimeManager extends BaseManager {
    /** @hidden */
    storeCache(body: any): any;
    search(searchString: string, filter?: Partial<AnimeSearchFilter>, offset?: number, maxCount?: number): Promise<Anime[]>;
    list(offset?: number, maxCount?: number): Promise<Array<Anime>>;
    listTop(filter?: Partial<TopAnimeFilter>, offset?: number, maxCount?: number): Promise<Anime[]>;
    listRecommended(offset?: number, maxCount?: number): Promise<Anime[]>;
    listScheduled(offset?: number, maxCount?: number): Promise<Anime[]>;
    random(sfw?: boolean): Promise<Anime>;
    get(animeId: number): Promise<Anime | undefined>;
    getFull(animeId: number): Promise<AnimeFull | undefined>;
    getCharacters(animeId: number): Promise<Array<AnimeCharacterReference> | undefined>;
    getStaff(animeId: number): Promise<Array<AnimeStaffReference> | undefined>;
    getEpisodes(animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimePartialEpisode> | undefined>;
    getEpisode(animeId: number, episodeId: number): Promise<AnimeEpisode | undefined>;
    getNews(animeId: number, offset?: number, maxCount?: number): Promise<Array<ContentNews> | undefined>;
    getTopics(animeId: number, topic?: 'all' | 'episode' | 'other'): Promise<Array<AnimeTopic> | undefined>;
    getVideos(animeId: number): Promise<AnimeVideo | undefined>;
    getPictures(animeId: number): Promise<Array<Image> | undefined>;
    getStatistics(animeId: number): Promise<AnimeStatistics | undefined>;
    getMoreInfo(animeId: number): Promise<string | null | undefined>;
    getRecommendations(animeId: number): Promise<Array<AnimeRecommendation> | undefined>;
    getUserUpdates(animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeUserUpdate> | undefined>;
    getReviews(animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeReview> | undefined>;
    getRelations(animeId: number): Promise<Array<AnimeRelationGroup<ContentRelationType>> | undefined>;
    getThemes(animeId: number): Promise<{
        openings: Array<string>;
        endings: Array<string>;
    } | undefined>;
    getExternal(animeId: number): Promise<Array<ContentExternal> | undefined>;
}
