import { Client } from '../core/client';
import { ContentImage } from '../resource/content/base';
import { BaseClass } from './base';
import { AnimeMeta, CharacterMeta, ClubMeta, MangaMeta, PersonMeta } from './meta';
import { Link } from './misc';
export type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary';
export declare class UserMeta extends BaseClass {
    readonly username: string;
    readonly url: string;
    readonly imageUrl: string | null;
    readonly lastOnline: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export declare class User extends BaseClass {
    /** @hidden */
    static parseGender(input: any): UserGender;
    /** @hidden */
    static parseStats(data: any): UserStats;
    /** @hidden */
    static parseFavorites(client: Client, data: any): UserFavorites;
    /** @hidden */
    static parseContentUpdate(data: any): UserContentUpdate;
    /** @hidden */
    static parseAnimeUpdate(client: Client, data: any): UserAnimeUpdate;
    /** @hidden */
    static parseMangaUpdate(client: Client, data: any): UserMangaUpdate;
    /** @hidden */
    static parseContentUpdates(client: Client, data: any): UserContentUpdates;
    /** @hidden */
    static parseAnimeHistory(client: Client, data: any): UserAnimeHistory;
    /** @hidden */
    static parseMangaHistory(client: Client, data: any): UserMangaHistory;
    /** @hidden */
    static parseRecommendation(client: Client, data: any): UserRecommendation;
    readonly username: string;
    readonly url: string;
    readonly imageUrl: string | null;
    readonly lastOnline: Date | null;
    readonly gender: UserGender;
    readonly birthday: Date | null;
    readonly location: string | null;
    readonly joined: Date | null;
    getStatistics(): Promise<UserStats>;
    getFavorites(): Promise<UserFavorites>;
    getUpdates(): Promise<UserContentUpdates>;
    getAbout(): Promise<string | null>;
    getHistory(type?: 'anime' | 'manga' | 'all'): Promise<(UserAnimeHistory | UserMangaHistory)[]>;
    getFriends(offset?: number, maxCount?: number): Promise<UserFriend[]>;
    getRecommendations(offset?: number, maxCount?: number): Promise<UserRecommendation[]>;
    getClubs(offset?: number, maxCount?: number): Promise<ClubMeta[]>;
    getExternal(): Promise<Link[]>;
    getFull(): Promise<UserFull>;
    constructor(client: Client, data: any);
}
export interface UserStats {
    readonly anime: {
        daysWatched: number;
        meanScore: number;
        watching: number;
        completed: number;
        onHold: number;
        dropped: number;
        planToWatch: number;
        totalEntries: number;
        rewatched: number;
        episodesWatched: number;
    };
    readonly manga: {
        daysRead: number;
        meanScore: number;
        reading: number;
        completed: number;
        onHold: number;
        dropped: number;
        planToRead: number;
        totalEntries: number;
        reread: number;
        chaptersRead: number;
        volumesRead: number;
    };
}
export interface UserFavorites {
    readonly anime: Array<AnimeMeta & {
        images: ContentImage;
    }>;
    readonly manga: Array<MangaMeta & {
        images: ContentImage;
    }>;
    readonly characters: Array<CharacterMeta & {
        images: ContentImage;
    }>;
    readonly people: Array<PersonMeta & {
        images: ContentImage;
    }>;
}
export interface UserContentUpdate {
    readonly score: number;
    readonly status: string;
    readonly date: Date;
}
export interface UserAnimeUpdate {
    readonly anime: AnimeMeta;
    readonly episodesSeen: number;
    readonly episodesTotal: number;
}
export interface UserMangaUpdate extends UserContentUpdate {
    readonly manga: MangaMeta;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
    readonly volumesRead: number;
    readonly volumesTotal: number;
}
export interface UserContentUpdates {
    readonly anime: Array<UserAnimeUpdate>;
    readonly manga: Array<UserMangaUpdate>;
}
export interface UserAnimeHistory {
    readonly anime: AnimeMeta;
    readonly increment: number;
    readonly date: Date;
}
export interface UserMangaHistory {
    readonly manga: MangaMeta;
    readonly increment: number;
    readonly date: Date;
}
export declare class UserFriend extends BaseClass {
    readonly username: string;
    readonly url: string;
    readonly imageUrl: string | null;
    readonly lastOnline: Date | null;
    readonly friendsSince: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export interface UserRecommendation {
    readonly user: {
        url: string;
        username: string;
    };
    readonly entries: Array<(AnimeMeta | MangaMeta) & {
        images: ContentImage;
    }>;
    readonly content: string;
}
export declare class UserFull extends User {
    readonly statistics: UserStats;
    readonly external: Array<Link>;
    readonly updates: {
        manga: UserMangaUpdate;
        anime: UserAnimeUpdate;
    };
    constructor(client: Client, data: any);
}
