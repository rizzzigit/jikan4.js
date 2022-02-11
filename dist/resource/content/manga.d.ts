/// <reference types="node" />
import { Client } from '../../core/client';
import { BaseClass, BaseResource } from '../base';
import { Content, ContentRelationType, ContentRelationGroup, ContentNews, ContentStatistics, ContentUserUpdate, ContentReviewScores, ContentReview } from './base';
import { PersonMeta, MagazineMeta, MangaGenreMeta, CharacterMeta, MangaMeta, AnimeMeta } from '../meta';
import { Image } from '../misc';
import { URL } from 'url';
export declare type MangaType = 'Manga' | 'Novel' | 'LightNovel' | 'OneShot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown';
export declare type MangaPublishStatus = 'Finished' | 'Publishing' | 'OnHiatus' | 'Discontinued' | 'NotYetPublished' | 'Unknown';
export declare class MangaPublishInformation extends BaseClass {
    /** @hidden */
    static parseStatus(input: any): MangaPublishStatus;
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
    getCharacters(): Promise<MangaCharacterReference[]>;
    getNews(offset?: number, maxCount?: number): Promise<MangaNews[]>;
    getTopics(): Promise<MangaTopic[]>;
    getPictures(): Promise<Image[]>;
    getStatistics(): Promise<MangaStatistics>;
    getMoreInfo(): Promise<string | null>;
    getUserUpdates(): Promise<MangaUserUpdate[]>;
    getReviews(): Promise<MangaReview[]>;
    getRelations(): Promise<MangaRelationGroup<ContentRelationType>[]>;
    constructor(client: Client, data: any);
}
export declare class MangaCharacterReference extends BaseClass {
    readonly mangaID: number;
    readonly character: CharacterMeta;
    readonly role: string;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaNews extends ContentNews {
    readonly mangaID: number;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaTopic extends BaseResource {
    readonly mangaID: number;
    readonly title: string;
    readonly date: Date;
    readonly authorUsername: string;
    readonly authorURL: URL;
    readonly comments: number;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaStatistics extends ContentStatistics {
    readonly mangaID: number;
    readonly reading: number;
    readonly planToRead: number;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaRecommendation extends BaseClass {
    readonly mangaID: number;
    readonly entry: MangaMeta;
    readonly URL: URL;
    readonly votes: number;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaUserUpdate extends ContentUserUpdate {
    readonly mangaID: number;
    readonly volumesRead: number;
    readonly volumesTotal: number;
    readonly chaptersRead: number;
    readonly chaptersTotal: number;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaReviewScores extends ContentReviewScores {
    readonly art: number;
    constructor(client: Client, data: any);
}
export declare class MangaReview extends ContentReview {
    readonly mangaID: number;
    readonly chaptersRead: number;
    readonly scores: MangaReviewScores;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, data: any);
}
export declare class MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
    readonly mangaID: number;
    readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>;
    getManga(): Promise<Manga>;
    constructor(client: Client, mangaID: number, relation: T, data: any);
}
