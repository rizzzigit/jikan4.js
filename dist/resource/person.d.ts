import { Client } from '../core/client';
import { BaseResource } from './base';
import { AnimeMeta, CharacterMeta, MangaMeta } from './meta';
import { Image } from './misc';
export interface PersonName {
    readonly name: string;
    readonly given: string | null;
    readonly family: string | null;
    readonly alternate: Array<string>;
    toString(): string;
}
export declare class Person extends BaseResource {
    /** @hidden */
    static parseName(data: any): PersonName;
    /** @hidden */
    static parseAnimeReference(client: Client, data: any): PersonAnimeReference;
    /** @hidden */
    static parseVoiceActorReference(client: Client, data: any): PersonVoiceActorReference;
    /** @hidden */
    static parseMangaReference(client: Client, data: any): PersonMangaReference;
    readonly websiteUrl: string | null;
    readonly image: Image;
    readonly name: PersonName;
    readonly birth: Date | null;
    readonly favorites: number;
    readonly about: string | null;
    getAnime(): Promise<PersonAnimeReference[]>;
    getVoiceActors(): Promise<PersonVoiceActorReference[]>;
    getManga(): Promise<PersonMangaReference[]>;
    getPictures(): Promise<Image[]>;
    getFull(): Promise<PersonFull>;
    constructor(client: Client, data: any);
}
export interface PersonAnimeReference {
    readonly position: string;
    readonly anime: AnimeMeta;
}
export interface PersonVoiceActorReference {
    readonly role: string;
    readonly anime: AnimeMeta;
    readonly character: CharacterMeta;
}
export interface PersonMangaReference {
    readonly position: string;
    readonly manga: MangaMeta;
}
export declare class PersonFull extends Person {
    readonly anime: Array<PersonAnimeReference>;
    readonly manga: Array<PersonMangaReference>;
    readonly voices: Array<PersonVoiceActorReference>;
    constructor(client: Client, data: any);
}
