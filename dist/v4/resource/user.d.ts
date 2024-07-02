import { Client } from '../core/client';
import { BaseClass } from './base';
import { AnimeMeta, CharacterMeta, ClubMeta, MangaMeta, PersonMeta } from './meta';
import { ImageFormatCollection, Link } from './misc';
export type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary';
export declare class UserMeta extends BaseClass {
    readonly username: string;
    readonly url: URL;
    readonly image: ImageFormatCollection | null;
    readonly lastOnline: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export declare class User extends BaseClass {
    static parseGender(input: any): UserGender;
    readonly username: string;
    readonly url: URL;
    readonly image: ImageFormatCollection | null;
    readonly lastOnline: Date | null;
    readonly gender: UserGender;
    readonly birthday: Date | null;
    readonly location: string | null;
    readonly joined: Date | null;
    getStatistics(): Promise<UserStats>;
    getFavorites(): Promise<UserFavorites>;
    getUpdates(): Promise<UserContentUpdates>;
    getAbout(): Promise<string | null>;
    getHistory(type?: 'anime' | 'manga' | 'all'): Promise<Array<UserAnimeHistory | UserMangaHistory>>;
    getFriends(offset?: number, maxCount?: number): Promise<Array<UserFriend>>;
    getRecommendations(offset?: number, maxCount?: number): Promise<Array<UserRecommendation>>;
    getClubs(offset?: number, maxCount?: number): Promise<Array<ClubMeta>>;
    getExternal(): Promise<Array<Link>>;
    getFull(): Promise<UserFull>;
    constructor(client: Client, data: any);
}
export declare class UserStats extends BaseClass {
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
    constructor(client: Client, data: any);
}
export declare class UserFavorites extends BaseClass {
    readonly anime: Array<AnimeMeta>;
    readonly manga: Array<MangaMeta>;
    readonly characters: Array<CharacterMeta>;
    readonly people: Array<PersonMeta>;
    constructor(client: Client, data: any);
}
export declare class UserContentUpdate extends BaseClass {
    readonly score: number;
    readonly status: string;
    readonly date: Date;
    constructor(client: Client, data: any);
}
export declare class UserAnimeUpdate extends UserContentUpdate {
    readonly anime: AnimeMeta;
    readonly episodesSeen: number;
    readonly episodesTotal: number;
    constructor(client: Client, data: any);
}
export declare class UserMangaUpdate extends UserContentUpdate {
    readonly manga: MangaMeta;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
    readonly volumesRead: number;
    readonly volumesTotal: number;
    constructor(client: Client, data: any);
}
export declare class UserContentUpdates extends BaseClass {
    readonly anime: Array<UserAnimeUpdate>;
    readonly manga: Array<UserMangaUpdate>;
    constructor(client: Client, data: any);
}
export declare class UserAnimeHistory extends BaseClass {
    readonly anime: AnimeMeta;
    readonly increment: number;
    readonly date: Date;
    constructor(client: Client, data: any);
}
export declare class UserMangaHistory extends BaseClass {
    readonly manga: MangaMeta;
    readonly increment: number;
    readonly date: Date;
    constructor(client: Client, data: any);
}
export declare class UserFriend extends BaseClass {
    readonly username: string;
    readonly url: URL;
    readonly image: ImageFormatCollection | null;
    readonly lastOnline: Date | null;
    readonly friendsSince: Date | null;
    getUser(): Promise<User>;
    constructor(client: Client, data: any);
}
export declare class UserRecommendation extends BaseClass {
    readonly user: {
        url: URL;
        username: string;
    };
    readonly entries: Array<(AnimeMeta | MangaMeta) & {
        images: ImageFormatCollection;
    }>;
    readonly content: string;
    constructor(client: Client, data: any);
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
