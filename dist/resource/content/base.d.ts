import { Client } from '../../core/client';
import { BaseClass, BaseResource } from '../base';
import { Image } from '../misc';
export declare class ContentImage extends BaseClass {
    readonly jpg: Image;
    readonly webp: Image;
    constructor(client: Client, data: any);
}
export declare class ContentTitle extends BaseClass {
    readonly default: string;
    readonly english: string | null;
    readonly japanese: string | null;
    readonly german: string | null;
    readonly spanish: string | null;
    readonly french: string | null;
    readonly synonyms: Array<string>;
    toString(): string;
    constructor(client: Client, data: any);
}
export type TitleArray = Array<{
    type: string;
    title: string;
}>;
export declare class Content extends BaseResource {
    static parseStatisticsScore(data: any): ContentStatisticsScore;
    /** @hidden */
    static parseStatistics(data: any): ContentStatistics;
    /** @hidden */
    static parseUserUpdate(data: any): ContentUserUpdate;
    /** @hidden */
    static parseUser(data: any): ContentUser;
    /** @hidden */
    static parseReview(data: any): ContentReview;
    /** @hidden */
    static parseNews(data: any): ContentNews;
    /** @hidden */
    static parseReactions(data: any): ContentReactions;
    /** @hidden */
    static parseRelationType(data: any): ContentRelationType;
    /** @hidden */
    static parseRelationGroup<T extends ContentRelationType>(client: Client, relation: T, data: any): ContentRelationGroup<T>;
    /** @hidden */
    static parseExternal(data: any): ContentExternal;
    readonly image: ContentImage;
    readonly title: ContentTitle;
    readonly titles: TitleArray;
    readonly score: number | null;
    readonly scoredBy: number | null;
    readonly rank: number;
    readonly popularity: number;
    readonly members: number;
    readonly favorites: number;
    readonly synopsis: string | null;
    readonly background: string | null;
    readonly approved: boolean;
    constructor(client: Client, data: any);
}
export interface ContentStatisticsScore {
    readonly score: number;
    readonly votes: number;
    readonly percentage: number;
}
export interface ContentStatistics {
    readonly completed: number;
    readonly onHold: number;
    readonly dropped: number;
    readonly total: number;
    readonly scores: ContentStatisticsScore;
}
export interface ContentNews {
    readonly id: number;
    readonly url: string;
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: string;
    readonly forumURL: string;
    readonly imageURL: string | null;
    readonly comments: number;
    readonly excerpt: string;
}
export interface ContentUser {
    readonly username: string;
    readonly url: string;
    readonly imageUrl: string | null;
}
export interface ContentReactions {
    readonly overall: number;
    readonly nice: number;
    readonly loveIt: number;
    readonly funny: number;
    readonly confusing: number;
    readonly informative: number;
    readonly wellWritten: number;
    readonly creative: number;
}
export interface ContentReview {
    readonly id: number;
    readonly url: string;
    readonly type: string;
    readonly votes: number;
    readonly date: Date;
    readonly review: string;
    readonly reactions: ContentReactions;
    readonly user: ContentUser;
    readonly isSpoiler: boolean;
    readonly isPreliminary: boolean;
    readonly tags: Array<string>;
}
export interface ContentUserUpdate {
    readonly user: ContentUser;
    readonly score: number;
    readonly status: string;
    readonly date: Date;
}
export type ContentRelationType = 'Adaptation' | 'SideStory' | 'Summary' | 'Sequel' | 'Prequel' | 'Character' | 'Other' | 'AlternativeVersion' | 'AlternativeSetting' | 'SpinOff' | 'ParentStory' | 'FullStory' | 'Unknown';
export interface ContentRelationGroup<T extends ContentRelationType> {
    readonly relation: T;
}
export interface ContentExternal {
    readonly name: string;
    readonly url: string | null;
}
