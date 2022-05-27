/// <reference types="node" />
import { Client } from '../core/client';
import { BaseClass, BaseResource } from './base';
import { URL } from 'url';
import { AnimeMeta, CharacterMeta, MangaMeta } from './meta';
import { Image } from './misc';
export declare class PersonName extends BaseClass {
    readonly name: string;
    readonly given: string | null;
    readonly family: string | null;
    readonly alternate: Array<string>;
    toString(): string;
    constructor(client: Client, data: any);
}
export declare class Person extends BaseResource {
    readonly websiteUrl: URL | null;
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
export declare class PersonAnimeReference extends BaseClass {
    readonly position: string;
    readonly anime: AnimeMeta;
    constructor(client: Client, data: any);
}
export declare class PersonVoiceActorReference extends BaseClass {
    readonly role: string;
    readonly anime: AnimeMeta;
    readonly character: CharacterMeta;
    constructor(client: Client, data: any);
}
export declare class PersonMangaReference extends BaseClass {
    readonly position: string;
    readonly manga: MangaMeta;
    constructor(client: Client, data: any);
}
export declare class PersonFull extends Person {
    readonly anime: Array<PersonAnimeReference>;
    readonly manga: Array<PersonMangaReference>;
    readonly voices: Array<PersonVoiceActorReference>;
    constructor(client: Client, data: any);
}
