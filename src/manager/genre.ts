import { AnimeGenreMeta, MangaGenreMeta, GenreType } from '../resource/meta'
import { BaseManager } from './base'

export const animeGenres: Array<[number, string]> = [
  [1, 'Action'], [2, 'Adventure'], [4, 'Comedy'],
  [5, 'Avant Garde'], [7, 'Mystery'], [8, 'Drama'], [10, 'Fantasy'],
  [14, 'Horror'], [22, 'Romance'], [24, 'Sci-Fi'], [26, 'Girls Love'],
  [28, 'Boys Love'], [30, 'Sports'], [36, 'Slice of Life'],
  [37, 'Supernatural'], [41, 'Suspense'], [46, 'Award Winning'],
  [47, 'Gourmet'], [48, 'Work Life']
]

export const animeExplicitGenres: Array<[number, string]> = [
  [9, 'Ecchi'], [12, 'Hentai'], [49, 'Erotica']
]

export const animeThemes: Array<[number, string]> = [
  [3, 'Cars'], [6, 'Demons'], [11, 'Game'], [13, 'Historical'],
  [17, 'Martial Arts'], [18, 'Mecha'], [19, 'Music'], [20, 'Parody'],
  [21, 'Samurai'], [23, 'School'], [29, 'Space'], [31, 'Super Power'],
  [32, 'Vampire'], [35, 'Harem'], [38, 'Military'], [39, 'Police'],
  [40, 'Psychological']
]

export const animeDemographics: Array<[number, string]> = [
  [15, 'Kids'], [25, 'Shoujo'], [27, 'Shounen'], [42, 'Seinen'],
  [43, 'Josei']
]

export const mangaGenres: Array<[number, string]> = [
  [1, 'Action'], [2, 'Adventure'], [4, 'Comedy'], [5, 'Avant Garde'],
  [7, 'Mystery'], [8, 'Drama'], [10, 'Fantasy'], [14, 'Horror'],
  [22, 'Romance'], [24, 'Sci-Fi'], [26, 'Girls Love'], [28, 'Boys Love'],
  [30, 'Sports'], [36, 'Slice of Life'], [37, 'Supernatural'],
  [45, 'Suspense'], [46, 'Award Winning'], [47, 'Gourmet'],
  [48, 'Work Life']
]

export const mangaExplicitGenres: Array<[number, string]> = [
  [9, 'Ecchi'], [12, 'Hentai'], [49, 'Erotica']
]

export const mangaThemes: Array<[number, string]> = [
  [3, 'Cars'], [6, 'Demons'], [11, 'Game'], [13, 'Historical'],
  [17, 'Martial Arts'], [18, 'Mecha'], [19, 'Music'], [20, 'Parody'],
  [21, 'Samurai'], [23, 'School'], [29, 'Space'], [31, 'Super Power'],
  [32, 'Vampire'], [35, 'Harem'], [38, 'Military'], [39, 'Police'],
  [40, 'Psychological'], [43, 'Doujinshi'], [44, 'Gender Bender']
]

export const mangaDemographics: Array<[number, string]> = [
  [15, 'Kids'], [25, 'Shoujo'], [27, 'Shounen'], [41, 'Seinen'],
  [42, 'Josei']
]

export class GenreManager extends BaseManager {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private generateGenre <T extends 'anime' | 'manga', E extends GenreType> (type: T, id: number, name: string, genreType: E):
    T extends 'anime' ? AnimeGenreMeta<E> :
    T extends 'manga' ? MangaGenreMeta<E> : never {
    const data = {
      mal_id: id,
      url: `https://myanimelist.net/anime/genre/${id}/${name.split(' ').join('_')}`,
      name
    }

    switch (type) {
      case 'anime': return <any> new AnimeGenreMeta(this.client, data, genreType)
      case 'manga': return <any> new MangaGenreMeta(this.client, data, genreType)

      default:
        throw new Error(`Unkonwn type: ${type}`)
    }
  }

  public listAnime (filter?: 'Genres' | 'ExplicitGenres' | 'Demographics' | 'Themes') {
    const list: Array<AnimeGenreMeta<GenreType>> = []

    if ((filter === 'Demographics') || !filter) {
      list.push(...animeDemographics.map((entry) => this.generateGenre('anime', ...entry, 'Demographic')))
    }

    if ((filter === 'ExplicitGenres') || !filter) {
      list.push(...animeExplicitGenres.map((entry) => this.generateGenre('anime', ...entry, 'Explicit')))
    }

    if ((filter === 'Genres') || !filter) {
      list.push(...animeGenres.map((entry) => this.generateGenre('anime', ...entry, 'Genre')))
    }

    if ((filter === 'Themes') || !filter) {
      list.push(...animeThemes.map((entry) => this.generateGenre('anime', ...entry, 'Theme')))
    }

    return list
  }

  public listManga (filter?: 'Genres' | 'ExplicitGenres' | 'Demographics' | 'Themes') {
    const list: Array<MangaGenreMeta<GenreType>> = []

    if ((filter === 'Demographics') || !filter) {
      list.push(...mangaDemographics.map((entry) => this.generateGenre('manga', ...entry, 'Demographic')))
    }

    if ((filter === 'ExplicitGenres') || !filter) {
      list.push(...mangaExplicitGenres.map((entry) => this.generateGenre('manga', ...entry, 'Explicit')))
    }

    if ((filter === 'Genres') || !filter) {
      list.push(...mangaGenres.map((entry) => this.generateGenre('manga', ...entry, 'Genre')))
    }

    if ((filter === 'Themes') || !filter) {
      list.push(...mangaThemes.map((entry) => this.generateGenre('manga', ...entry, 'Theme')))
    }

    return list
  }

  public getAnime (id: number) {
    return this.listAnime().find((genre) => genre.id === id)
  }

  public getAnimeByName (name: string) {
    return this.listAnime().find((genre) => genre.name === name)
  }

  public getManga (id: number) {
    return this.listManga().find((genre) => genre.id === id)
  }

  public getMangaByName (name: string) {
    return this.listManga().find((genre) => genre.name === name)
  }
}
