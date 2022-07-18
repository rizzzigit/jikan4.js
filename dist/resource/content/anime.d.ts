/// <reference types="node" />
import { Client } from '../../core/client';
import { Content, ContentRelationType, ContentRelationGroup, ContentStatistics, ContentNews, ContentUserUpdate, ContentReviewScores, ContentReview, ContentExternal } from './base';
import { BaseClass, BaseResource } from '../base';
import { YoutubeVideo, Image } from '../misc';
import { ProducerMeta, AnimeGenreMeta, PersonMeta, CharacterMeta, AnimeMeta, MangaMeta } from '../meta';
import { URL } from 'url';
export declare type AnimeType = 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | 'Unknown';
export declare type AnimeAirStatus = 'FinishedAiring' | 'Airing' | 'NotYetAired' | 'Unknown';
export declare type AnimeRating = 'None' | 'G' | 'PG' | 'PG-13+' | 'R-17+' | 'R+' | 'Rx' | 'Unknown';
export declare type AnimeSeason = 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'Unknown';
export declare class AnimeAirInformation extends BaseClass {
    /** @hidden */
    static parseStatus(input: any): AnimeAirStatus;
    readonly status: AnimeAirStatus;
    readonly airing: boolean;
    readonly airedFrom: Date | null;
    readonly airedTo: Date | null;
    constructor(client: Client, data: any);
}
export declare class Anime extends Content {
    /** @hidden */
    static parseType(input: any): AnimeType;
    /** @hidden */
    static parseRating(input: any): AnimeRating;
    /** @hidden */
    static parseSeason(input: any): AnimeSeason | null;
    readonly trailer: YoutubeVideo | null;
    readonly type: AnimeType;
    readonly source: string | null;
    readonly episodes: this['type'] extends 'TV' ? number : null;
    readonly airInfo: AnimeAirInformation;
    readonly duration: number | null;
    readonly rating: AnimeRating;
    readonly season: AnimeSeason | null;
    readonly year: number | null;
    readonly producers: Array<ProducerMeta>;
    readonly licensors: Array<ProducerMeta>;
    readonly studios: Array<ProducerMeta>;
    readonly genres: Array<AnimeGenreMeta<'Genre'>>;
    readonly explicitGenres: Array<AnimeGenreMeta<'Explicit'>>;
    readonly themes: Array<AnimeGenreMeta<'Theme'>>;
    readonly demographics: Array<AnimeGenreMeta<'Demographic'>>;
    get isExplicit(): boolean;
    getCharacters(): Promise<AnimeCharacterReference[]>;
    getStaff(): Promise<AnimeStaffReference[]>;
    getEpisodes(offset?: number, maxCount?: number): Promise<AnimePartialEpisode[]>;
    getEpisode(episodeId: number): Promise<AnimeEpisode>;
    getNews(offset?: number, maxCount?: number): Promise<ContentNews[]>;
    getTopics(topic?: 'all' | 'episode' | 'other'): Promise<AnimeTopic[]>;
    getVideos(): Promise<AnimeVideo>;
    getPictures(): Promise<Image[]>;
    getStatistics(): Promise<AnimeStatistics>;
    getMoreInfo(): Promise<string | null>;
    getRecommendations(): Promise<AnimeRecommendation[]>;
    getUserUpdates(offset?: number, maxCount?: number): Promise<AnimeUserUpdate[]>;
    getReviews(offset?: number, maxCount?: number): Promise<AnimeReview[]>;
    getRelations(): Promise<AnimeRelationGroup<ContentRelationType>[]>;
    getThemes(): Promise<{
        openings: Array<string>;
        endings: Array<string>;
    }>;
    getExternal(): Promise<ContentExternal[]>;
    getFull(): Promise<AnimeFull>;
    constructor(client: Client, data: any);
}
export declare class AnimeVoiceActorReference extends BaseClass {
    readonly language: string;
    readonly person: PersonMeta;
    constructor(client: Client, data: any);
}
export declare class AnimeCharacterReference extends BaseClass {
    readonly role: string;
    readonly character: CharacterMeta;
    readonly voiceActors: Array<AnimeVoiceActorReference>;
    constructor(client: Client, data: any);
}
export declare class AnimeStaffReference extends BaseClass {
    readonly positions: Array<string>;
    readonly person: PersonMeta;
    constructor(client: Client, data: any);
}
export declare class AnimeEpisodeTitle extends BaseClass {
    readonly default: string;
    readonly japanese: string | null;
    readonly romanji: string | null;
    toString(): string;
    constructor(client: Client, data: any);
}
export declare class AnimeEpisode extends BaseClass {
    readonly animeId: number;
    readonly episodeId: number;
    readonly URL: URL | null;
    readonly title: AnimeEpisodeTitle;
    readonly duration: number;
    readonly aired: Date | null;
    readonly filler: boolean;
    readonly recap: boolean;
    readonly synopsis: string | null;
    constructor(client: Client, animeId: number, data: any);
}
export declare class AnimePartialEpisode extends AnimeEpisode {
    readonly synopsis: null;
    readonly forumUrl: URL | null;
    getFullEpisode(): Promise<AnimeEpisode>;
    constructor(client: Client, animeId: number, data: any);
}
export declare class AnimeTopic extends BaseResource {
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: URL;
    readonly comments: number;
    constructor(client: Client, data: any);
}
export declare class AnimePromo extends BaseClass {
    readonly title: string;
    readonly trailer: YoutubeVideo;
    constructor(client: Client, data: any);
}
export declare class AnimeEpisodeVideo extends BaseResource {
    readonly title: string;
    readonly episode: number;
    readonly imageURL: URL | null;
    constructor(client: Client, data: any);
}
export declare class AnimeVideo extends BaseClass {
    readonly promos: Array<AnimePromo>;
    readonly episodes: Array<AnimeEpisodeVideo>;
    constructor(client: Client, data: any);
}
export declare class AnimeStatistics extends ContentStatistics {
    readonly watching: number;
    readonly planToWatch: number;
    constructor(client: Client, data: any);
}
export declare class AnimeRecommendation extends BaseClass {
    readonly entry: AnimeMeta;
    readonly URL: URL | null;
    readonly votes: number;
    constructor(client: Client, data: any);
}
export declare class AnimeUserUpdate extends ContentUserUpdate {
    readonly episodesSeen: number;
    readonly episodesTotal: number;
    constructor(client: Client, data: any);
}
export declare class AnimeReviewScores extends ContentReviewScores {
    readonly animation: number;
    readonly sound: number;
    constructor(client: Client, data: any);
}
export declare class AnimeReview extends ContentReview {
    readonly episodesWatched: number;
    readonly scores: AnimeReviewScores;
    constructor(client: Client, data: any);
}
export declare class AnimeRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
    readonly items: T extends 'Adaptation' ? Array<MangaMeta> : Array<AnimeMeta>;
    constructor(client: Client, relation: T, data: any);
}
export declare class AnimeFull extends Anime {
    readonly relations: Array<AnimeRelationGroup<ContentRelationType>>;
    readonly themeSongs: {
        optenings: Array<string>;
        endings: Array<string>;
    };
    readonly external: Array<ContentExternal>;
    constructor(client: Client, data: any);
}
