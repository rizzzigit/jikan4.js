import { BaseManager } from './base'
import { ContentRelationType } from '../resource/content/base'
import {
  Manga,
  MangaCharacterReference,
  MangaNews,
  MangaTopic,
  MangaStatistics,
  MangaUserUpdate,
  MangaReview,
  MangaRelationGroup
} from '../resource/content/manga'
import { Image } from '../resource/misc'
import { translateObject } from '../utils'
import { MangaGenreMeta, MagazineMeta } from '../resource/meta'

export interface MangaSearchFilter {
  type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua'
  score: number
  minScore: number
  maxScore: number
  status: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming'
  sfw: boolean
  genres: Array<number | MangaGenreMeta>
  excludeGenres: Array<number | MangaGenreMeta>
  magazines: Array<number | MagazineMeta>
  orderBy:
    | 'mal_id'
    | 'title'
    | 'start_date'
    | 'end_date'
    | 'chapters'
    | 'volumes'
    | 'score'
    | 'scored_by'
    | 'rank'
    | 'popularity'
    | 'members'
    | 'favorites'
  sort: 'desc' | 'asc'
}

export class MangaManager extends BaseManager {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (data: any) {
    return super.storeCache(`manga/${data.mal_id}`, data)
  }

  public async search (searchString: string, filter?: Partial<MangaSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('manga', offset, maxCount, {
      [searchString.length === 1 ? 'length' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'score': return [key, `${value}`]
          case 'minScore': return ['min_score', `${value}`]
          case 'maxScore': return ['max_score', `${value}`]
          case 'sfw': return [key, '']
          case 'genres': return [key, `${(<Array<any>> value).map((value: any) => value instanceof MangaGenreMeta ? value.ID : value)}`]
          case 'excludeGenres': return ['genres_exclude', `${(<Array<any>> value).map((value: any) => value instanceof MangaGenreMeta ? value.ID : value)}`]
          case 'magazines': return ['magazine', `${(<Array<any>> value).map((value: any) => value instanceof MagazineMeta ? value.ID : value)}`]
          case 'orderBy': return ['order_by', `${value}`]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((data) => this.storeCache(data)).map((manga) => new Manga(this.client, manga))
  }

  public async list (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('manga', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((manga: any) => new Manga(this.client, manga))
  }

  public async listTop (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('top/manga', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((manga: any) => new Manga(this.client, manga))
  }

  public async listRecommended (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('recommendations/manga', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((manga: any) => new Manga(this.client, manga))
  }

  public async random (): Promise<Manga> {
    const rawData = await this.requestResource('random/manga', { disableCaching: 'true' })

    return new Manga(this.client, rawData)
  }

  public async get (mangaID: number): Promise<Manga | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}`)

    return rawData ? new Manga(this.client, rawData) : undefined
  }

  public async getCharacters (mangaID: number): Promise<Array<MangaCharacterReference> | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/characters`)

    return rawData ? rawData.map((characterReference: any) => new MangaCharacterReference(this.client, mangaID, characterReference)) : undefined
  }

  public async getNews (mangaID: number, offset?: number, maxCount?: number): Promise<Array<MangaNews> | undefined> {
    const rawData = await this.requestPaginatedResource(`manga/${mangaID}/news`, offset, maxCount)

    return rawData ? rawData.map((news: any) => new MangaNews(this.client, mangaID, news)) : undefined
  }

  public async getTopics (mangaID: number): Promise<Array<MangaTopic> | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/forum`)

    return rawData ? rawData.map((topic: any) => new MangaTopic(this.client, mangaID, topic)) : undefined
  }

  public async getPictures (mangaID: number): Promise<Array<Image> | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }

  public async getStatistics (mangaID: number): Promise<MangaStatistics | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/statistics`)

    return rawData ? new MangaStatistics(this.client, mangaID, rawData) : undefined
  }

  public async getMoreInfo (mangaID: number): Promise<string | null | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/moreinfo`)

    return rawData ? rawData.moreinfo || null : undefined
  }

  public async getUserUpdates (mangaID: number): Promise<Array<MangaUserUpdate> | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/userupdates`)

    return rawData ? rawData.map((userUpdate: any) => new MangaUserUpdate(this.client, mangaID, userUpdate)) : undefined
  }

  public async getReviews (mangaID: number): Promise<Array<MangaReview> | undefined> {
    const rawData = await this.requestResource(`manga/${mangaID}/reviews`)

    return rawData ? rawData.map((review: any) => new MangaReview(this.client, mangaID, review)) : undefined
  }

  public async getRelations (mangaID: number): Promise<Array<MangaRelationGroup<ContentRelationType>> | undefined> {
    const rawData = await this.requestPaginatedResource(`manga/${mangaID}/relations`)

    return rawData ? rawData.map((relation) => new MangaRelationGroup(this.client, mangaID, MangaRelationGroup.parseRelation(relation.relation), relation)) : undefined
  }
}
