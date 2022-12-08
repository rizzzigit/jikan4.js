import { Client } from '../../core/client';
import { Content, ContentRelationType, ContentRelationGroup, ContentNews, ContentStatistics, ContentUserUpdate, ContentReactions, ContentReview, ContentExternal } from './base';
import { PersonMeta, MagazineMeta, MangaGenreMeta, CharacterMeta, MangaMeta, AnimeMeta } from '../meta';
import { Image } from '../misc';
export type MangaType = 'Manga' | 'Novel' | 'LightNovel' | 'OneShot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown';
export type MangaPublishStatus = 'Finished' | 'Publishing' | 'OnHiatus' | 'Discontinued' | 'NotYetPublished' | 'Unknown';
export interface MangaPublishInformation {
    readonly status: MangaPublishStatus;
    readonly publishing: boolean;
    readonly publishedFrom: Date | null;
    readonly publishedTo: Date | null;
}
export declare class Manga extends Content {
    /** @hidden */
    static parsePublishStatus(input: any): MangaPublishStatus;
    /** @hidden */
    static parsePublishInfo(data: any): MangaPublishInformation;
    /** @hidden */
    static parseType(input: any): MangaType;
    /** @hidden */
    static parseStatistics(data: any): MangaStatistics;
    /** @hidden */
    static parseUserUpdate(data: any): MangaUserUpdate;
    /** @hidden */
    static parseReview(data: any): MangaReview;
    /** @hidden */
    static parseTopReview(client: Client, data: any): TopMangaReview;
    /** @hidden */
    static parseRelationGroup<T extends ContentRelationType>(client: Client, relation: T, data: any): MangaRelationGroup<T>;
    /** @hidden */
    static parseCharacerReference(client: Client, data: any): MangaCharacterReference;
    /** @hidden */
    static parseTopic(data: any): MangaTopic;
    /** @hidden */
    static parseRecommendation(client: Client, data: any): MangaRecommendation;
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
    getCharacters(): Promise<MangaCharacterReference[]>;
    getNews(offset?: number, maxCount?: number): Promise<ContentNews[]>;
    getTopics(): Promise<MangaTopic[]>;
    getPictures(): Promise<Image[]>;
    getStatistics(): Promise<MangaStatistics>;
    getMoreInfo(): Promise<string | null>;
    getUserUpdates(): Promise<MangaUserUpdate[]>;
    getReviews(): Promise<MangaReview[]>;
    getRelations(): Promise<MangaRelationGroup<ContentRelationType>[]>;
    getExternal(): Promise<ContentExternal[]>;
    getFull(): Promise<MangaFull>;
    constructor(client: Client, data: any);
}
export interface MangaCharacterReference {
    readonly character: CharacterMeta;
    readonly role: string;
}
export interface MangaTopic {
    readonly id: number;
    readonly url: string;
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: string;
    readonly comments: number;
}
export interface MangaStatistics extends ContentStatistics {
    readonly reading: number;
    readonly planToRead: number;
}
export interface MangaRecommendation {
    readonly entry: MangaMeta;
    readonly URL: string;
    readonly votes: number;
}
export interface MangaUserUpdate extends ContentUserUpdate {
    readonly volumesRead: number;
    readonly volumesTotal: number;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
}
export interface MangaReview extends ContentReview {
    readonly chaptersRead: number;
    readonly reactions: ContentReactions;
}
export interface TopMangaReview extends MangaReview {
    readonly manga: MangaMeta;
}
export interface MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
    readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>;
}
export declare class MangaFull extends Manga {
    readonly relations: Array<MangaRelationGroup<ContentRelationType>>;
    readonly external: Array<ContentExternal>;
    constructor(client: Client, data: any);
}
