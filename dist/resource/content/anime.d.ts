import { Client } from '../../core/client';
import { Content, ContentRelationType, ContentRelationGroup, ContentStatistics, ContentNews, ContentUserUpdate, ContentReactions, ContentReview, ContentExternal } from './base';
import { YoutubeVideo, Image, Link } from '../misc';
import { ProducerMeta, AnimeGenreMeta, PersonMeta, CharacterMeta, AnimeMeta, MangaMeta } from '../meta';
export type AnimeType = 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | 'Unknown';
export type AnimeAirStatus = 'FinishedAiring' | 'Airing' | 'NotYetAired' | 'Unknown';
export type AnimeRating = 'None' | 'G' | 'PG' | 'PG-13+' | 'R-17+' | 'R+' | 'Rx' | 'Unknown';
export type AnimeSeason = 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'Unknown';
export interface AnimeAirInformation {
    readonly status: AnimeAirStatus;
    readonly airing: boolean;
    readonly airedFrom: Date | null;
    readonly airedTo: Date | null;
}
export declare class Anime extends Content {
    /** @hidden */
    static parseAirInfo(data: any): AnimeAirInformation;
    /** @hidden */
    static parseAirInfoStatus(input: any): AnimeAirStatus;
    /** @hidden */
    static parseType(input: any): AnimeType;
    /** @hidden */
    static parseRating(input: any): AnimeRating;
    /** @hidden */
    static parseSeason(input: any): AnimeSeason | null;
    /** @hidden */
    static parseVoiceActorReference(client: Client, data: any): AnimeVoiceActorReference;
    /** @hidden */
    static parseCharacterReference(client: Client, data: any): AnimeCharacterReference;
    /** @hidden */
    static parseStaffReference(client: Client, data: any): AnimeStaffReference;
    /** @hidden */
    static parseEpisodeTitle(data: any): AnimeEpisodeTitle;
    /** @hidden */
    static parseEpisode(data: any): AnimeEpisode;
    /** @hidden */
    static parsePartialEpisode(data: any): AnimePartialEpisode;
    /** @hidden */
    static parseTopc(data: any): AnimeTopic;
    /** @hidden */
    static parsePromo(data: any): AnimePromo;
    /** @hidden */
    static parseEpisodeVideo(data: any): AnimeEpisodeVideo;
    /** @hidden */
    static parseMusicVideo(data: any): AnimeMusicVideo;
    /** @hidden */
    static parseVideo(data: any): AnimeVideo;
    /** @hidden */
    static parseStatistics(data: any): AnimeStatistics;
    /** @hidden */
    static parseRecommendation(client: Client, data: any): AnimeRecommendation;
    /** @hidden */
    static parseUserUpdate(data: any): AnimeUserUpdate;
    /** @hidden */
    static parseReview(data: any): AnimeReview;
    /** @hidden */
    static parseTopReview(client: Client, data: any): TopAnimeReview;
    /** @hidden */
    static parseRelationGroup<T extends ContentRelationType>(client: Client, relation: T, data: any): AnimeRelationGroup<T>;
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
    getVideosEpisodes(offset?: number, maxCount?: number): Promise<AnimeEpisodeVideo[]>;
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
    getStreamingLinks(): Promise<Link[]>;
    getFull(): Promise<AnimeFull>;
    constructor(client: Client, data: any);
}
export interface AnimeVoiceActorReference {
    readonly language: string;
    readonly person: PersonMeta;
}
export interface AnimeCharacterReference {
    readonly role: string;
    readonly character: CharacterMeta;
    readonly voiceActors: Array<AnimeVoiceActorReference>;
}
export interface AnimeStaffReference {
    readonly positions: Array<string>;
    readonly person: PersonMeta;
}
export interface AnimeEpisodeTitle {
    readonly default: string;
    readonly japanese: string | null;
    readonly romanji: string | null;
    toString(): string;
}
export interface AnimeEpisode {
    readonly animeId: number;
    readonly episodeId: number;
    readonly URL: string | null;
    readonly title: AnimeEpisodeTitle;
    readonly duration: number;
    readonly aired: Date | null;
    readonly filler: boolean;
    readonly recap: boolean;
    readonly synopsis: string | null;
}
export interface AnimePartialEpisode extends AnimeEpisode {
    readonly synopsis: null;
    readonly forumUrl: string | null;
}
export interface AnimeTopic {
    readonly id: number;
    readonly url: string;
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: string;
    readonly comments: number;
}
export interface AnimePromo {
    readonly title: string;
    readonly trailer: YoutubeVideo;
}
export interface AnimeEpisodeVideo {
    readonly id: number;
    readonly url: string | null;
    readonly title: string;
    readonly episode: number;
    readonly imageURL: string | null;
}
export interface AnimeMusicVideo {
    readonly title: string;
    readonly video: YoutubeVideo;
    readonly meta: {
        title: string;
        author: string;
    };
}
export interface AnimeVideo {
    readonly promos: Array<AnimePromo>;
    readonly episodes: Array<AnimeEpisodeVideo>;
    readonly musicVideos: Array<AnimeMusicVideo>;
}
export interface AnimeStatistics extends ContentStatistics {
    readonly watching: number;
    readonly planToWatch: number;
}
export interface AnimeRecommendation {
    entry: AnimeMeta;
    URL: string | null;
    votes: number;
}
export interface AnimeUserUpdate extends ContentUserUpdate {
    readonly episodesSeen: number;
    readonly episodesTotal: number;
}
export interface AnimeReview extends ContentReview {
    readonly episodesWatched: number;
    readonly reactions: ContentReactions;
}
export interface TopAnimeReview extends AnimeReview {
    readonly anime: AnimeMeta;
}
export interface AnimeRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
    readonly items: T extends 'Adaptation' ? Array<MangaMeta> : Array<AnimeMeta>;
}
export declare class AnimeFull extends Anime {
    readonly relations: Array<AnimeRelationGroup<ContentRelationType>>;
    readonly themeSongs: {
        optenings: Array<string>;
        endings: Array<string>;
    };
    readonly external: Array<ContentExternal>;
    readonly streamingLinks: Array<Link>;
    constructor(client: Client, data: any);
}
