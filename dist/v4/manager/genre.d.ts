import { AnimeGenreMeta, MangaGenreMeta, GenreType } from '../resource/meta';
import { BaseManager } from './base';
export declare const animeGenres: Array<[number, string]>;
export declare const animeExplicitGenres: Array<[number, string]>;
export declare const animeThemes: Array<[number, string]>;
export declare const animeDemographics: Array<[number, string]>;
export declare const mangaGenres: Array<[number, string]>;
export declare const mangaExplicitGenres: Array<[number, string]>;
export declare const mangaThemes: Array<[number, string]>;
export declare const mangaDemographics: Array<[number, string]>;
export declare class GenreManager extends BaseManager {
    /** @hidden */
    private generateGenre;
    listAnime(filter?: 'Genres' | 'ExplicitGenres' | 'Demographics' | 'Themes'): AnimeGenreMeta<GenreType>[];
    listManga(filter?: 'Genres' | 'ExplicitGenres' | 'Demographics' | 'Themes'): MangaGenreMeta<GenreType>[];
    getAnime(id: number): AnimeGenreMeta<GenreType> | undefined;
    getAnimeByName(name: string): AnimeGenreMeta<GenreType> | undefined;
    getManga(id: number): MangaGenreMeta<GenreType> | undefined;
    getMangaByName(name: string): MangaGenreMeta<GenreType> | undefined;
}
