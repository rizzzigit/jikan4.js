import { Client } from '../../core/client';
import { BaseClass, BaseResource } from '../base';
import { Content, ContentRelationType, ContentRelationGroup, ContentNews, ContentStatistics, ContentUserUpdate, ContentReview, ContentExternal } from './base';
import { PersonMeta, MagazineMeta, MangaGenreMeta, CharacterMeta, MangaMeta, AnimeMeta } from '../meta';
import { ImageFormatCollection } from '../misc';
export type MangaType = 'Manga' | 'Novel' | 'Light Novel' | 'One Shot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown';
export type MangaPublishStatus = 'Finished' | 'Publishing' | 'On Hiatus' | 'Discontinued' | 'Not Yet Published' | 'Unknown';
export declare class MangaPublishInformation extends BaseClass {
    /** @hidden */
    static parseMangaPublishStatus(input: any): MangaPublishStatus;
    readonly status: MangaPublishStatus;
    readonly publishing: boolean;
    readonly publishedFrom: Date | null;
    readonly publishedTo: Date | null;
    constructor(client: Client, data: any);
}
export declare class Manga extends Content {
    /** @hidden */
    static parseType(input: any): MangaType;
    readonly type: MangaType;
    readonly chapters: number;
    readonly volumes: number;
    readonly publishInfo: MangaPublishInformation;
    readonly authors: Array<PersonMeta>;
    readonly serializations: Array<MagazineMeta>;
    readonly genres: Array<MangaGenreMeta<'Genre'>>;
    readonly explicitGenres: Array<MangaGenreMeta<'Explicit'>>;
    readonly themes: Array<MangaGenreMeta<'Theme'>>;
    readonly demographics: Array<MangaGenreMeta<'Demographic'>>;
    get isExplicit(): boolean;
    getCharacters(): Promise<Array<MangaCharacterReference>>;
    getNews(offset?: number, maxCount?: number): Promise<Array<ContentNews>>;
    getTopics(): Promise<Array<MangaTopic>>;
    getPictures(): Promise<Array<ImageFormatCollection>>;
    getStatistics(): Promise<MangaStatistics>;
    getMoreInfo(): Promise<string | null>;
    getRecommendations(): Promise<Array<MangaRecommendation>>;
    getUserUpdates(): Promise<Array<MangaUserUpdate>>;
    getReviews(): Promise<Array<MangaReview>>;
    getRelations(): Promise<Array<MangaRelationGroup<ContentRelationType>>>;
    getExternal(): Promise<Array<ContentExternal>>;
    getFull(): Promise<MangaFull>;
    constructor(client: Client, data: any);
}
export declare class MangaCharacterReference extends BaseClass {
    readonly character: CharacterMeta;
    readonly role: string;
    constructor(client: Client, data: any);
}
export declare class MangaTopic extends BaseResource {
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: URL;
    readonly comments: number;
    constructor(client: Client, data: any);
}
export declare class MangaStatistics extends ContentStatistics {
    readonly reading: number;
    readonly planToRead: number;
    constructor(client: Client, data: any);
}
export declare class MangaRecommendation extends BaseClass {
    readonly entry: MangaMeta;
    readonly URL: URL;
    readonly votes: number;
    constructor(client: Client, data: any);
}
export declare class MangaUserUpdate extends ContentUserUpdate {
    readonly volumesRead: number;
    readonly volumesTotal: number;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
    constructor(client: Client, data: any);
}
export declare class MangaReview extends ContentReview {
    readonly chaptersRead: number;
    constructor(client: Client, data: any);
}
export declare class MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
    readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>;
    constructor(client: Client, relation: T, data: any);
}
export declare class MangaFull extends Manga {
    readonly relations: Array<MangaRelationGroup<ContentRelationType>>;
    readonly external: Array<ContentExternal>;
    constructor(client: Client, data: any);
}
