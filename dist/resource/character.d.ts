import { Client } from '../core/client';
import { BaseResource } from './base';
import { ContentImage } from './content/base';
import { MangaMeta, PersonMeta, AnimeMeta } from './meta';
import { Image } from './misc';
export declare class Character extends BaseResource {
    /** @hidden */
    static parseAnimeReference(client: Client, data: any): CharacterAnimeReference;
    /** @hidden */
    static parseMangaReference(client: Client, data: any): CharacterMangaReference;
    /** @hidden */
    static parseVoiceActorReference(client: Client, data: any): CharacterVoiceActorReference;
    readonly image: ContentImage;
    readonly name: string;
    readonly nameKanji: string | null;
    readonly nicknames: Array<string>;
    readonly favorites: number;
    readonly about: string | null;
    getAnime(): Promise<CharacterAnimeReference[]>;
    getManga(): Promise<CharacterMangaReference[]>;
    getVoiceActors(): Promise<CharacterVoiceActorReference[]>;
    getPictures(): Promise<Image[]>;
    getFull(): Promise<CharacterFull>;
    constructor(client: Client, data: any);
}
export interface CharacterAnimeReference {
    readonly role: string;
    readonly anime: AnimeMeta;
}
export interface CharacterMangaReference {
    readonly role: string;
    readonly manga: MangaMeta;
}
export interface CharacterVoiceActorReference {
    readonly language: string;
    readonly person: PersonMeta;
}
export declare class CharacterFull extends Character {
    readonly anime: Array<CharacterAnimeReference>;
    readonly manga: Array<CharacterMangaReference>;
    readonly voices: Array<CharacterVoiceActorReference>;
    constructor(client: Client, data: any);
}
