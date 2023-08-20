import { Client } from '../../core/client';
import { BaseClass, BaseResource } from '../base';
import { ImageFormatCollection } from '../misc';
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
    readonly image: ImageFormatCollection;
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
export declare class ContentStatisticsScore extends BaseClass {
    readonly score: number;
    readonly votes: number;
    readonly percentage: number;
    constructor(client: Client, data: any);
}
export declare class ContentStatistics extends BaseClass {
    readonly completed: number;
    readonly onHold: number;
    readonly dropped: number;
    readonly total: number;
    readonly scores: ContentStatisticsScore;
    constructor(client: Client, data: any);
}
export declare class ContentNews extends BaseResource {
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: URL;
    readonly forumURL: URL;
    readonly image: ImageFormatCollection | null;
    readonly comments: number;
    readonly excerpt: string;
    constructor(client: Client, data: any);
}
export declare class ContentUser extends BaseClass {
    readonly username: string;
    readonly url: URL;
    readonly image: ImageFormatCollection | null;
    constructor(client: Client, data: any);
}
export declare class ContentReactions extends BaseClass {
    readonly overall: number;
    readonly nice: number;
    readonly loveIt: number;
    readonly funny: number;
    readonly confusing: number;
    readonly informative: number;
    readonly wellWritten: number;
    readonly creative: number;
    constructor(client: Client, data: any);
}
export declare class ContentReview extends BaseResource {
    readonly type: string;
    readonly votes: number;
    readonly date: Date;
    readonly review: string;
    readonly reactions: ContentReactions;
    readonly user: ContentUser;
    readonly isSpoiler: boolean;
    readonly isPreliminary: boolean;
    readonly tags: Array<string>;
    constructor(client: Client, data: any);
}
export declare class ContentUserUpdate extends BaseClass {
    readonly user: ContentUser;
    readonly score: number;
    readonly status: string;
    readonly date: Date;
    constructor(client: Client, data: any);
}
export type ContentRelationType = 'Adaptation' | 'SideStory' | 'Summary' | 'Sequel' | 'Prequel' | 'Character' | 'Other' | 'AlternativeVersion' | 'AlternativeSetting' | 'SpinOff' | 'ParentStory' | 'FullStory' | 'Unknown';
export declare class ContentRelationGroup<T extends ContentRelationType> extends BaseClass {
    /** @hidden */
    static parseRelation(data: any): ContentRelationType;
    readonly relation: T;
    constructor(client: Client, relation: T, data: any);
}
export declare class ContentExternal extends BaseClass {
    readonly name: string;
    readonly url: URL;
    constructor(client: Client, data: any);
}
