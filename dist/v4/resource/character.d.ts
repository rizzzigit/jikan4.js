import { Client } from '../core/client';
import { BaseClass, BaseResource } from './base';
import { MangaMeta, PersonMeta, AnimeMeta } from './meta';
import { ImageFormatCollection } from './misc';
export declare class Character extends BaseResource {
    readonly image: ImageFormatCollection;
    readonly name: string;
    readonly nameKanji: string | null;
    readonly nicknames: Array<string>;
    readonly favorites: number;
    readonly about: string | null;
    getAnime(): Promise<CharacterAnimeReference[]>;
    getManga(): Promise<CharacterMangaReference[]>;
    getVoiceActors(): Promise<CharacterVoiceActorReference[]>;
    getPictures(): Promise<ImageFormatCollection[]>;
    getFull(): Promise<CharacterFull>;
    constructor(client: Client, data: any);
}
export declare class CharacterAnimeReference extends BaseClass {
    readonly role: string;
    readonly anime: AnimeMeta;
    constructor(client: Client, data: any);
}
export declare class CharacterMangaReference extends BaseClass {
    readonly role: string;
    readonly manga: MangaMeta;
    constructor(client: Client, data: any);
}
export declare class CharacterVoiceActorReference extends BaseClass {
    readonly language: string;
    readonly person: PersonMeta;
    constructor(client: Client, data: any);
}
export declare class CharacterFull extends Character {
    readonly anime: Array<CharacterAnimeReference>;
    readonly manga: Array<CharacterMangaReference>;
    readonly voices: Array<CharacterVoiceActorReference>;
    constructor(client: Client, data: any);
}
