import { Client } from '../core/client';
import { BaseClass, BaseResource } from './base';
import { ContentImage } from './content/base';
import { MangaMeta, PersonMeta, AnimeMeta } from './meta';
import { Image } from './misc';
export declare class Character extends BaseResource {
    readonly image: ContentImage;
    readonly name: string;
    readonly nicknames: Array<string>;
    readonly favorites: number;
    readonly about: string | null;
    getAnime(): Promise<CharacterAnimeReference[]>;
    getManga(): Promise<CharacterMangaReference[]>;
    getVoiceActors(): Promise<CharacterVoiceActorReference[]>;
    getPictures(): Promise<Image[]>;
    constructor(client: Client, data: any);
}
export declare class CharacterAnimeReference extends BaseClass {
    readonly characterID: number;
    readonly role: string;
    readonly anime: AnimeMeta;
    getCharacter(): Promise<Character>;
    constructor(client: Client, characterID: number, data: any);
}
export declare class CharacterMangaReference extends BaseClass {
    readonly characterID: number;
    readonly role: string;
    readonly manga: MangaMeta;
    getCharacter(): Promise<Character>;
    constructor(client: Client, characterID: number, data: any);
}
export declare class CharacterVoiceActorReference extends BaseClass {
    readonly characterID: number;
    readonly language: string;
    readonly person: PersonMeta;
    getCharacter(): Promise<Character>;
    constructor(client: Client, characterID: number, data: any);
}
