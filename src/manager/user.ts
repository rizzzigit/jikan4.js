import {
  User,
  UserFriend,
  UserMeta,
  UserFull
} from '../resource/user'
import { translateObject } from '../utils'
import { BaseManager } from './base'
import { Anime, AnimeReview } from '../resource/content/anime'
import { Manga, MangaReview } from '../resource/content/manga'
import { ClubMeta } from '../resource/meta'
import { Link } from '../Jikan'

export interface UserSearchFilter {
  gender: 'any' | 'male' | 'female' | 'nonbinary'
  location: string
  maxAge: number
  minAge: number
}

export class UserManager extends BaseManager {
  public async search (searchString: string, filter?: Partial<UserSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('users', offset, maxCount, {
      q: searchString,
      ...filter && translateObject(filter, (key, value) => [key, value])
    })

    return rawData.map((user) => new User(this.client, user))
  }

  public async list (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('users', offset, maxCount)

    return rawData.map((data) => new UserMeta(this.client, data))
  }

  public async get (username: string) {
    const rawData = await this.request(`users/${username}`)

    return rawData ? new User(this.client, rawData) : undefined
  }

  public async getFull (username: string) {
    const rawData = await this.request(`users/${username}/full`)

    return rawData ? new UserFull(this.client, rawData) : undefined
  }

  public async getStatistics (username: string) {
    const rawData = await this.request(`users/${username}/statistics`)

    return rawData ? User.parseStats(rawData) : undefined
  }

  public async getFavorites (username: string) {
    const rawData = await this.request(`users/${username}/favorites`)

    return rawData ? User.parseFavorites(this.client, rawData) : undefined
  }

  public async getUpdates (username: string) {
    const rawData = await this.request(`users/${username}/userupdates`)

    return rawData ? User.parseContentUpdates(this.client, rawData) : undefined
  }

  public async getAbout (username: string) {
    const rawData = await this.request(`users/${username}/about`)

    return rawData ? <string | null> rawData.about : undefined
  }

  public async getHistory (username: string, type: 'anime' | 'manga' | 'all' = 'all') {
    const rawData = <Array<any>> await this.request(`users/${username}/history${type !== 'all' ? `/${type}` : ''}`)

    return rawData.map((data) => {
      switch (data.entry.type) {
        case 'manga': return User.parseMangaHistory(this.client, data)
        case 'anime': return User.parseAnimeHistory(this.client, data)

        default: throw new Error(`Unknown entry type: ${data.entry.type}`)
      }
    })
  }

  public async getFriends (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/friends`, offset, maxCount)

    return rawData ? rawData.map((friend) => new UserFriend(this.client, friend)) : undefined
  }

  public async getReviews (username: string, offset?: number, maxCount?: number): Promise<Array<AnimeReview | MangaReview> | undefined> {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/reviews`, offset, maxCount)

    return rawData
      ? rawData.map((review) => {
        if ('episodes_watched' in review) {
          return Anime.parseReview(review)
        } else {
          return Manga.parseReview(review)
        }
      })
      : undefined
  }

  public async getRecommendations (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/recommendations`, offset, maxCount)

    return rawData ? rawData.map((recommendation) => User.parseRecommendation(this.client, recommendation)) : undefined
  }

  public async getClubs (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/clubs`, offset, maxCount)

    return rawData ? rawData.map((club) => new ClubMeta(this.client, club)) : undefined
  }

  public async getExternal (username: string): Promise<Array<Link> | undefined> {
    const rawData = <Array<any>> await this.request(`users/${username}/external`)

    return rawData ? rawData.map((data) => Object.assign(data, { url: new URL(data.url) })) : undefined
  }
}
