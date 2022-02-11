import { BaseManager } from '../manager/base';
import { ContentRelationType } from '../resource/content/base';
import { Anime, AnimeCharacterReference, AnimeStaffReference, AnimePartialEpisode, AnimeEpisode, AnimeTopic, AnimeVideo, AnimeStatistics, AnimeRecommendation, AnimeUserUpdate, AnimeReview, AnimeRelationGroup } from '../resource/content/anime';
import { Image } from '../resource/misc';
import { AnimeGenreMeta, ProducerMeta } from '../resource/meta';
export interface AnimeSearchFilter {
    type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music';
    score: number;
    minScore: number;
    maxScore: number;
    scoredBy: number;
    status: 'airing' | 'complete' | 'upcoming';
    rating: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx';
    sfw: boolean;
    genres: Array<number | AnimeGenreMeta>;
    excludeGenres: Array<number | AnimeGenreMeta>;
    producers: Array<number | ProducerMeta>;
    orderBy: 'mal_id' | 'title' | 'type' | 'rating' | 'start_date' | 'end_date' | 'episodes' | 'score' | 'scored_by' | 'rank' | 'popularity' | 'members' | 'favorites';
    sort: 'desc' | 'asc';
}
export declare class AnimeManager extends BaseManager {
    /** @hidden */
    storeCache(data: any): any;
    search(searchString: string, filter?: Partial<AnimeSearchFilter>, offset?: number, maxCount?: number): Promise<Anime[]>;
    list(offset?: number, maxCount?: number): Promise<Array<Anime>>;
    listTop(offset?: number, maxCount?: number): Promise<Anime[]>;
    listRecommended(offset?: number, maxCount?: number): Promise<Anime[]>;
    listScheduled(offset?: number, maxCount?: number): Promise<Anime[]>;
    random(): Promise<Anime>;
    get(animeID: number): Promise<Anime | undefined>;
    getCharacters(animeID: number): Promise<Array<AnimeCharacterReference> | undefined>;
    getStaff(animeID: number): Promise<Array<AnimeStaffReference> | undefined>;
    getEpisodes(animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimePartialEpisode> | undefined>;
    getEpisode(animeID: number, episodeID: number): Promise<AnimeEpisode | undefined>;
    getNews(animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeTopic> | undefined>;
    getTopics(animeID: number, topic?: 'all' | 'episode' | 'other'): Promise<Array<AnimeTopic> | undefined>;
    getVideos(animeID: number): Promise<AnimeVideo | undefined>;
    getPictures(animeID: number): Promise<Array<Image> | undefined>;
    getStatistics(animeID: number): Promise<AnimeStatistics | undefined>;
    getMoreInfo(animeID: number): Promise<string | null | undefined>;
    getRecommendations(animeID: number): Promise<Array<AnimeRecommendation> | undefined>;
    getUserUpdates(animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeUserUpdate> | undefined>;
    getReviews(animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeReview> | undefined>;
    getRelations(animeID: number): Promise<Array<AnimeRelationGroup<ContentRelationType>> | undefined>;
    getThemes(animeID: number): Promise<{
        openings: Array<string>;
        endings: Array<string>;
    } | undefined>;
}
