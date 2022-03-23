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
import { MangaGenreMeta, MagazineMeta, GenreType } from '../resource/meta'

export interface MangaSearchFilter {
  type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'manhua'
  score: number
  minScore: number
  maxScore: number
  status: 'publishing' | 'complete' | 'hiatus' | 'discontinued' | 'upcoming'
  sfw: boolean
  genres: Array<number | MangaGenreMeta<GenreType>>
  excludeGenres: Array<number | MangaGenreMeta<GenreType>>
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

export interface TopMangaFilter {
  type: 'manga' | 'novel' | 'lightnovel' | 'oneshot' | 'doujin' | 'manhwa' | 'mahua'
  filter: 'publishing' | 'upcoming' | 'bypopularity' | 'favorite'
}

export class MangaManager extends BaseManager {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (body: any) {
    return super.storeCache({ path: `manga/${body.mal_id}` }, body)
  }

  public async search (searchString: string, filter?: Partial<MangaSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('manga', offset, maxCount, {
      disableCaching: true,
      [searchString.length === 1 ? 'length' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'score': return [key, `${value}`]
          case 'minScore': return ['min_score', `${value}`]
          case 'maxScore': return ['max_score', `${value}`]
          case 'sfw': return [key, '']
          case 'genres': return [key, `${(<Array<any>> value).map((value: any) => value instanceof MangaGenreMeta ? value.id : value)}`]
          case 'excludeGenres': return ['genres_exclude', `${(<Array<any>> value).map((value: any) => value instanceof MangaGenreMeta ? value.id : value)}`]
          case 'magazines': return [key, `${(<Array<any>> value).map((value: any) => value instanceof MagazineMeta ? value.id : value)}`]
          case 'orderBy': return ['order_by', `${value}`]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((manga) => new Manga(this.client, this.storeCache(manga)))
  }

  public async list (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('manga', offset, maxCount)

    return rawData.map((manga: any) => new Manga(this.client, this.storeCache(manga)))
  }

  public async listTop (filter?: TopMangaFilter, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('top/manga', offset, maxCount, { ...filter })

    return rawData.map((manga: any) => new Manga(this.client, this.storeCache(manga)))
  }

  public async listRecommended (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('recommendations/manga', offset, maxCount)

    return rawData.map((manga: any) => new Manga(this.client, this.storeCache(manga)))
  }

  public async random (): Promise<Manga> {
    const rawData = await this.request('random/manga', { disableCaching: 'true' })

    return new Manga(this.client, rawData)
  }

  public async get (mangaId: number): Promise<Manga | undefined> {
    const rawData = await this.request(`manga/${mangaId}`)

    return rawData ? new Manga(this.client, rawData) : undefined
  }

  public async getCharacters (mangaId: number): Promise<Array<MangaCharacterReference> | undefined> {
    const rawData = await this.request(`manga/${mangaId}/characters`)

    return rawData ? rawData.map((characterReference: any) => new MangaCharacterReference(this.client, mangaId, characterReference)) : undefined
  }

  public async getNews (mangaId: number, offset?: number, maxCount?: number): Promise<Array<MangaNews> | undefined> {
    const rawData = await this.requestPaginated(`manga/${mangaId}/news`, offset, maxCount)

    return rawData ? rawData.map((news: any) => new MangaNews(this.client, mangaId, news)) : undefined
  }

  public async getTopics (mangaId: number): Promise<Array<MangaTopic> | undefined> {
    const rawData = await this.request(`manga/${mangaId}/forum`)

    return rawData ? rawData.map((topic: any) => new MangaTopic(this.client, mangaId, topic)) : undefined
  }

  public async getPictures (mangaId: number): Promise<Array<Image> | undefined> {
    const rawData = await this.request(`manga/${mangaId}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }

  public async getStatistics (mangaId: number): Promise<MangaStatistics | undefined> {
    const rawData = await this.request(`manga/${mangaId}/statistics`)

    return rawData ? new MangaStatistics(this.client, mangaId, rawData) : undefined
  }

  public async getMoreInfo (mangaId: number): Promise<string | null | undefined> {
    const rawData = await this.request(`manga/${mangaId}/moreinfo`)

    return rawData ? rawData.moreinfo || null : undefined
  }

  public async getUserUpdates (mangaId: number): Promise<Array<MangaUserUpdate> | undefined> {
    const rawData = await this.request(`manga/${mangaId}/userupdates`)

    return rawData ? rawData.map((userUpdate: any) => new MangaUserUpdate(this.client, mangaId, userUpdate)) : undefined
  }

  public async getReviews (mangaId: number): Promise<Array<MangaReview> | undefined> {
    const rawData = await this.request(`manga/${mangaId}/reviews`)

    return rawData ? rawData.map((review: any) => new MangaReview(this.client, mangaId, review)) : undefined
  }

  public async getRelations (mangaId: number): Promise<Array<MangaRelationGroup<ContentRelationType>> | undefined> {
    const rawData = await this.requestPaginated(`manga/${mangaId}/relations`)

    return rawData ? rawData.map((relation) => new MangaRelationGroup(this.client, mangaId, MangaRelationGroup.parseRelation(relation.relation), relation)) : undefined
  }
}
