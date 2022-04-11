import {
  User,
  UserContentUpdates,
  UserFavorites,
  UserFriend, UserMeta,
  UserRecommendation,
  UserStats,
  UserAnimeHistory,
  UserMangaHistory
} from '../resource/user'
import { translateObject } from '../utils'
import { BaseManager } from './base'
import { AnimeReview } from '../resource/content/anime'
import { MangaReview } from '../resource/content/manga'
import { ClubMeta } from '../resource/meta'

export interface UserSearchFilter {
  gender: 'any' | 'male' | 'female' | 'nonbinary'
  location: string
  maxAge: number
  minAge: number
}

export class UserManager extends BaseManager {
  public async search (searchString: string, filter?: Partial<UserSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('users', offset, maxCount, {
      disableCaching: 'true',
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

  public async getStatistics (username: string) {
    const rawData = await this.request(`users/${username}/statistics`)

    return rawData ? new UserStats(this.client, username, rawData) : undefined
  }

  public async getFavorites (username: string) {
    const rawData = await this.request(`users/${username}/favorites`)

    return rawData ? new UserFavorites(this.client, username, rawData) : undefined
  }

  public async getUpdates (username: string) {
    const rawData = await this.request(`users/${username}/userupdates`)

    return rawData ? new UserContentUpdates(this.client, username, rawData) : undefined
  }

  public async getAbout (username: string) {
    const rawData = await this.request(`users/${username}/about`)

    return rawData ? <string | null> rawData.about : undefined
  }

  public async getHistory (username: string, type: 'anime' | 'manga' | 'all' = 'all') {
    const rawData = <Array<any>> await this.request(`users/${username}/history${type !== 'all' ? `/${type}` : ''}`)

    return rawData.map((data) => {
      switch (data.entry.type) {
        case 'manga': return new UserMangaHistory(this.client, username, data)
        case 'anime': return new UserAnimeHistory(this.client, username, data)

        default: throw new Error(`Unknown entry type: ${data.entry.type}`)
      }
    })
  }

  public async getFriends (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/friends`, offset, maxCount)

    return rawData.map((friend) => new UserFriend(this.client, friend))
  }

  public async getReviews (username: string, offset?: number, maxCount?: number): Promise<Array<AnimeReview | MangaReview>> {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/reviews`, offset, maxCount)

    return rawData.map((review) => {
      if ('episodes_watched' in review) {
        return new AnimeReview(this.client, review.anime.mal_id, review)
      } else {
        return new MangaReview(this.client, review.manga.mal_id, review)
      }
    })
  }

  public async getRecommendations (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/recommendations`, offset, maxCount)

    return rawData.map((recommendation) => new UserRecommendation(this.client, recommendation))
  }

  public async getClubs (username: string, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`users/${username}/clubs`, offset, maxCount)

    return rawData.map((club) => new ClubMeta(this.client, club))
  }
}
