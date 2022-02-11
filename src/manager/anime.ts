import { BaseManager } from '../manager/base'
import { ContentRelationType } from '../resource/content/base'
import {
  Anime,
  AnimeCharacterReference,
  AnimeStaffReference,
  AnimePartialEpisode,
  AnimeEpisode,
  AnimeNews,
  AnimeTopic,
  AnimeVideo,
  AnimeStatistics,
  AnimeRecommendation,
  AnimeUserUpdate,
  AnimeReview,
  AnimeRelationGroup
} from '../resource/content/anime'
import { Image } from '../resource/misc'
import { translateObject } from '../utils'
import { AnimeGenreMeta, ProducerMeta, GenreType } from '../resource/meta'

export interface AnimeSearchFilter {
  type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'
  score: number
  minScore: number
  maxScore: number
  scoredBy: number
  status: 'airing' | 'complete' | 'upcoming'
  rating: 'g' | 'pg' | 'pg13' | 'r17' | 'r' | 'rx'
  sfw: boolean
  genres: Array<number | AnimeGenreMeta<GenreType>>
  excludeGenres: Array<number | AnimeGenreMeta<GenreType>>
  producers: Array<number | ProducerMeta>
  orderBy:
    | 'mal_id'
    | 'title'
    | 'type'
    | 'rating'
    | 'start_date'
    | 'end_date'
    | 'episodes'
    | 'score'
    | 'scored_by'
    | 'rank'
    | 'popularity'
    | 'members'
    | 'favorites'
  sort: 'desc' | 'asc'
}

export class AnimeManager extends BaseManager {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (data: any) {
    return super.storeCache(`anime/${data.mal_id}`, data)
  }

  public async search (searchString: string, filter?: Partial<AnimeSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('anime', offset, maxCount, {
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'score': return [key, `${value}`]
          case 'minScore': return ['min_score', `${value}`]
          case 'maxScore': return ['max_score', `${value}`]
          case 'sfw': return [key, '']
          case 'genres': return [key, `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.id : value)}`]
          case 'excludeGenres': return ['genres_exclude', `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.id : value)}`]
          case 'producers': return ['producer', `${(<Array<any>> value).map((value: any) => value instanceof ProducerMeta ? value.id : value)}`]
          case 'orderBy': return ['order_by', `${value}`]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((anime) => this.storeCache(anime)).map((anime) => new Anime(this.client, anime))
  }

  public async list (offset?: number, maxCount?: number): Promise<Array<Anime>> {
    const rawData = <Array<any>> await this.requestPaginatedResource('anime', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((anime: any) => new Anime(this.client, anime))
  }

  public async listTop (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('top/anime', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((anime: any) => new Anime(this.client, anime))
  }

  public async listRecommended (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('recommendations/anime', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((anime: any) => new Anime(this.client, anime))
  }

  public async listScheduled (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('schedules', offset, maxCount)

    return rawData.map((data: any) => this.storeCache(data)).map((anime: any) => new Anime(this.client, anime))
  }

  public async random (): Promise<Anime> {
    const rawData = await this.requestResource('random/anime', { disableCaching: 'true' })

    this.storeCache(rawData)
    return new Anime(this.client, rawData)
  }

  public async get (animeId: number): Promise<Anime | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}`)

    return rawData ? new Anime(this.client, rawData) : undefined
  }

  public async getCharacters (animeId: number): Promise<Array<AnimeCharacterReference> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/characters`)

    return rawData ? rawData.map((characterReference: any) => new AnimeCharacterReference(this.client, animeId, characterReference)) : undefined
  }

  public async getStaff (animeId: number): Promise<Array<AnimeStaffReference> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/staff`)

    return rawData ? rawData.map((staffReference: any) => new AnimeStaffReference(this.client, animeId, staffReference)) : undefined
  }

  public async getEpisodes (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimePartialEpisode> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeId}/episodes`, offset, maxCount)

    return rawData ? rawData.map((partialEpisode) => new AnimePartialEpisode(this.client, animeId, partialEpisode)) : undefined
  }

  public async getEpisode (animeId: number, episodeID: number): Promise<AnimeEpisode | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/episodes/${episodeID}`)

    return rawData ? new AnimeEpisode(this.client, animeId, rawData) : undefined
  }

  public async getNews (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeNews> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeId}/news`, offset, maxCount)

    return rawData ? rawData.map((news) => new AnimeNews(this.client, animeId, news)) : undefined
  }

  public async getTopics (animeId: number, topic: 'all' | 'episode' | 'other' = 'all'): Promise<Array<AnimeTopic> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/forum`, { topic })

    return rawData ? rawData.map((topic: any) => new AnimeTopic(this.client, animeId, topic)) : undefined
  }

  public async getVideos (animeId: number): Promise<AnimeVideo | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/videos`)

    return rawData ? new AnimeVideo(this.client, animeId, rawData) : undefined
  }

  public async getPictures (animeId: number): Promise<Array<Image> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }

  public async getStatistics (animeId: number): Promise<AnimeStatistics | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/statistics`)

    return rawData ? new AnimeStatistics(this.client, animeId, rawData) : undefined
  }

  public async getMoreInfo (animeId: number): Promise<string | null | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/moreinfo`)

    return rawData ? rawData.moreinfo || null : undefined
  }

  public async getRecommendations (animeId: number): Promise<Array<AnimeRecommendation> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/recommendations`)

    return rawData ? rawData.map((recommendation: any) => new AnimeRecommendation(this.client, animeId, recommendation)) : undefined
  }

  public async getUserUpdates (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeUserUpdate> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeId}/userupdates`, offset, maxCount)

    return rawData ? rawData.map((userUpdate: any) => new AnimeUserUpdate(this.client, animeId, userUpdate)) : undefined
  }

  public async getReviews (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeReview> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeId}/reviews`, offset, maxCount)

    return rawData ? rawData.map((review: any) => new AnimeReview(this.client, animeId, review)) : undefined
  }

  public async getRelations (animeId: number): Promise<Array<AnimeRelationGroup<ContentRelationType>> | undefined> {
    const rawData = await this.requestResource(`anime/${animeId}/relations`)

    return rawData ? rawData.map((relation: any) => new AnimeRelationGroup(this.client, animeId, AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined
  }

  public async getThemes (animeId: number): Promise<{
    openings: Array<string>
    endings: Array<string>
  } | undefined> {
    return await this.requestResource(`anime/${animeId}/themes`)
  }
}
