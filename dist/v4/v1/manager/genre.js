"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreManager = exports.mangaDemographics = exports.mangaThemes = exports.mangaExplicitGenres = exports.mangaGenres = exports.animeDemographics = exports.animeThemes = exports.animeExplicitGenres = exports.animeGenres = void 0;
const meta_1 = require("../resource/meta");
const base_1 = require("./base");
exports.animeGenres = [
    [1, 'Action'], [2, 'Adventure'], [4, 'Comedy'],
    [5, 'Avant Garde'], [7, 'Mystery'], [8, 'Drama'], [10, 'Fantasy'],
    [14, 'Horror'], [22, 'Romance'], [24, 'Sci-Fi'], [26, 'Girls Love'],
    [28, 'Boys Love'], [30, 'Sports'], [36, 'Slice of Life'],
    [37, 'Supernatural'], [41, 'Suspense'], [46, 'Award Winning'],
    [47, 'Gourmet'], [48, 'Work Life']
];
exports.animeExplicitGenres = [
    [9, 'Ecchi'], [12, 'Hentai'], [49, 'Erotica']
];
exports.animeThemes = [
    [3, 'Cars'], [6, 'Demons'], [11, 'Game'], [13, 'Historical'],
    [17, 'Martial Arts'], [18, 'Mecha'], [19, 'Music'], [20, 'Parody'],
    [21, 'Samurai'], [23, 'School'], [29, 'Space'], [31, 'Super Power'],
    [32, 'Vampire'], [35, 'Harem'], [38, 'Military'], [39, 'Police'],
    [40, 'Psychological']
];
exports.animeDemographics = [
    [15, 'Kids'], [25, 'Shoujo'], [27, 'Shounen'], [42, 'Seinen'],
    [43, 'Josei']
];
exports.mangaGenres = [
    [1, 'Action'], [2, 'Adventure'], [4, 'Comedy'], [5, 'Avant Garde'],
    [7, 'Mystery'], [8, 'Drama'], [10, 'Fantasy'], [14, 'Horror'],
    [22, 'Romance'], [24, 'Sci-Fi'], [26, 'Girls Love'], [28, 'Boys Love'],
    [30, 'Sports'], [36, 'Slice of Life'], [37, 'Supernatural'],
    [45, 'Suspense'], [46, 'Award Winning'], [47, 'Gourmet'],
    [48, 'Work Life']
];
exports.mangaExplicitGenres = [
    [9, 'Ecchi'], [12, 'Hentai'], [49, 'Erotica']
];
exports.mangaThemes = [
    [3, 'Cars'], [6, 'Demons'], [11, 'Game'], [13, 'Historical'],
    [17, 'Martial Arts'], [18, 'Mecha'], [19, 'Music'], [20, 'Parody'],
    [21, 'Samurai'], [23, 'School'], [29, 'Space'], [31, 'Super Power'],
    [32, 'Vampire'], [35, 'Harem'], [38, 'Military'], [39, 'Police'],
    [40, 'Psychological'], [43, 'Doujinshi'], [44, 'Gender Bender']
];
exports.mangaDemographics = [
    [15, 'Kids'], [25, 'Shoujo'], [27, 'Shounen'], [41, 'Seinen'],
    [42, 'Josei']
];
class GenreManager extends base_1.BaseManager {
    /** @hidden */
    generateGenre(type, id, name, genreType) {
        const data = {
            mal_id: id,
            url: `https://myanimelist.net/anime/genre/${id}/${name.split(' ').join('_')}`,
            name
        };
        switch (type) {
            case 'anime': return new meta_1.AnimeGenreMeta(this.client, data, genreType);
            case 'manga': return new meta_1.MangaGenreMeta(this.client, data, genreType);
            default:
                throw new Error(`Unkonwn type: ${type}`);
        }
    }
    listAnime(filter) {
        const list = [];
        if ((filter === 'Demographics') || !filter) {
            list.push(...exports.animeDemographics.map((entry) => this.generateGenre('anime', ...entry, 'Demographic')));
        }
        if ((filter === 'ExplicitGenres') || !filter) {
            list.push(...exports.animeExplicitGenres.map((entry) => this.generateGenre('anime', ...entry, 'Explicit')));
        }
        if ((filter === 'Genres') || !filter) {
            list.push(...exports.animeGenres.map((entry) => this.generateGenre('anime', ...entry, 'Genre')));
        }
        if ((filter === 'Themes') || !filter) {
            list.push(...exports.animeThemes.map((entry) => this.generateGenre('anime', ...entry, 'Theme')));
        }
        return list;
    }
    listManga(filter) {
        const list = [];
        if ((filter === 'Demographics') || !filter) {
            list.push(...exports.mangaDemographics.map((entry) => this.generateGenre('manga', ...entry, 'Demographic')));
        }
        if ((filter === 'ExplicitGenres') || !filter) {
            list.push(...exports.mangaExplicitGenres.map((entry) => this.generateGenre('manga', ...entry, 'Explicit')));
        }
        if ((filter === 'Genres') || !filter) {
            list.push(...exports.mangaGenres.map((entry) => this.generateGenre('manga', ...entry, 'Genre')));
        }
        if ((filter === 'Themes') || !filter) {
            list.push(...exports.mangaThemes.map((entry) => this.generateGenre('manga', ...entry, 'Theme')));
        }
        return list;
    }
    getAnime(id) {
        return this.listAnime().find((genre) => genre.id === id);
    }
    getAnimeByName(name) {
        return this.listAnime().find((genre) => genre.name === name);
    }
    getManga(id) {
        return this.listManga().find((genre) => genre.id === id);
    }
    getMangaByName(name) {
        return this.listManga().find((genre) => genre.name === name);
    }
}
exports.GenreManager = GenreManager;
