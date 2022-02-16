/// <reference types="node" />
import { URL } from 'url';
import { Client } from '../core/client';
import { ContentImage } from '../Jikan';
import { BaseClass } from './base';
import { Club } from './club';
import { AnimeMeta, CharacterMeta, MangaMeta, PersonMeta } from './meta';
export declare type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary';
export declare class UserMeta extends BaseClass {
    readonly username: string;
    readonly url: URL;
    readonly imageUrl: URL | null;
    readonly lastOnline: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export declare class User extends BaseClass {
    static parseGender(input: any): UserGender;
    readonly username: string;
    readonly url: URL;
    readonly imageUrl: URL | null;
    readonly lastOnline: Date | null;
    readonly gender: UserGender;
    readonly birthday: Date | null;
    readonly location: string | null;
    readonly joined: Date | null;
    getStatistics(): Promise<UserStats>;
    getFavorites(): Promise<UserFavorites>;
    getUpdates(): Promise<UserContentUpdates>;
    getAbout(): Promise<string | null>;
    getHistory(type?: 'anime' | 'manga' | 'all'): Promise<(UserMangaHistory | UserAnimeHistory)[]>;
    getFriends(offset?: number, maxCount?: number): Promise<UserFriend[]>;
    getRecommendations(offset?: number, maxCount?: number): Promise<UserRecommendation[]>;
    getClubs(offset?: number, maxCount?: number): Promise<Club[]>;
    constructor(client: Client, data: any);
}
export declare class UserStats extends BaseClass {
    readonly username: string;
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
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserFavorites extends BaseClass {
    readonly username: string;
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
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserContentUpdate extends BaseClass {
    readonly username: string;
    readonly score: number;
    readonly status: string;
    readonly date: Date;
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserAnimeUpdate extends UserContentUpdate {
    readonly anime: AnimeMeta;
    readonly episodesSeen: number;
    readonly episodesTotal: number;
    constructor(client: Client, username: string, data: any);
}
export declare class UserMangaUpdate extends UserContentUpdate {
    readonly manga: MangaMeta;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
    readonly volumesRead: number;
    readonly volumesTotal: number;
    constructor(client: Client, username: string, data: any);
}
export declare class UserContentUpdates extends BaseClass {
    readonly username: string;
    readonly anime: Array<UserAnimeUpdate>;
    readonly manga: Array<UserMangaUpdate>;
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserAnimeHistory extends BaseClass {
    readonly username: string;
    readonly anime: AnimeMeta;
    readonly increment: number;
    readonly date: Date;
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserMangaHistory extends BaseClass {
    readonly username: string;
    readonly manga: MangaMeta;
    readonly increment: number;
    readonly date: Date;
    getUser(): Promise<User>;
    constructor(client: Client, username: string, data: any);
}
export declare class UserFriend extends BaseClass {
    readonly username: string;
    readonly url: URL;
    readonly imageUrl: URL | null;
    readonly lastOnline: Date;
    readonly friendsSince: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export declare class UserRecommendation extends BaseClass {
    readonly user: {
        url: URL;
        username: string;
    };
    readonly entry: (AnimeMeta | MangaMeta) & {
        images: ContentImage;
    };
    readonly id: number;
    readonly content: string;
    constructor(client: Client, data: any);
}
