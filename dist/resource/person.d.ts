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
    constructor(client: Client, data: any);
}
export declare class PersonAnimeReference extends BaseClass {
    readonly personId: number;
    readonly position: string;
    readonly anime: AnimeMeta;
    getPerson(): Promise<Person>;
    constructor(client: Client, personId: number, data: any);
}
export declare class PersonVoiceActorReference extends BaseClass {
    readonly personId: number;
    readonly role: string;
    readonly anime: AnimeMeta;
    readonly character: CharacterMeta;
    getPerson(): Promise<Person>;
    constructor(client: Client, personId: number, data: any);
}
export declare class PersonMangaReference extends BaseClass {
    readonly personId: number;
    readonly position: string;
    readonly manga: MangaMeta;
    getPerson(): Promise<Person>;
    constructor(client: Client, personId: number, data: any);
}
