import { Client } from '../core/client';
import { BaseResource } from './base';
import { Character } from './character';
import { Anime } from './content/anime';
import { Manga } from './content/manga';
import { Person } from './person';
import { ImageFormatCollection } from './misc';
export type MetaType = 'Magazine' | 'Producer' | 'AnimeGenre' | 'MangaGenre' | 'Person' | 'Character' | 'Club';
export type ContentMetaType = 'Anime' | 'Manga';
export declare class Meta<T extends MetaType> extends BaseResource {
    readonly type: T;
    readonly name: string;
    constructor(client: Client, data: any, type: T);
}
export declare class ContentMeta<T extends ContentMetaType> extends BaseResource {
    readonly type: T;
    readonly title: string;
    readonly image: ImageFormatCollection;
    constructor(client: Client, data: any, type: T);
}
export declare class MagazineMeta extends Meta<'Magazine'> {
    constructor(client: Client, data: any);
}
export declare class ProducerMeta extends Meta<'Producer'> {
    constructor(client: Client, data: any);
}
export declare class ClubMeta extends Meta<'Club'> {
    constructor(client: Client, data: any);
}
export type GenreType = 'Genre' | 'Explicit' | 'Theme' | 'Demographic';
export declare class AnimeGenreMeta<T extends GenreType> extends Meta<'AnimeGenre'> {
    constructor(client: Client, data: any, type: T);
    readonly genreType: T;
}
export declare class MangaGenreMeta<T extends GenreType> extends Meta<'MangaGenre'> {
    constructor(client: Client, data: any, type: T);
    readonly genreType: T;
}
export declare class PersonMeta extends Meta<'Person'> {
    readonly image: ImageFormatCollection | null;
    getFull(): Promise<Person>;
    constructor(client: Client, data: any);
}
export declare class CharacterMeta extends Meta<'Character'> {
    readonly image: ImageFormatCollection;
    getFull(): Promise<Character>;
    constructor(client: Client, data: any);
}
export declare class AnimeMeta extends ContentMeta<'Anime'> {
    getFull(): Promise<Anime>;
    constructor(client: Client, data: any);
}
export declare class MangaMeta extends ContentMeta<'Manga'> {
    getFull(): Promise<Manga>;
    constructor(client: Client, data: any);
}
