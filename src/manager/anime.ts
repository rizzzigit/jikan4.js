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
          case 'genres': return [key, `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.ID : value)}`]
          case 'excludeGenres': return ['genres_exclude', `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.ID : value)}`]
          case 'producers': return ['producer', `${(<Array<any>> value).map((value: any) => value instanceof ProducerMeta ? value.ID : value)}`]
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

  public async get (animeID: number): Promise<Anime | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}`)

    return rawData ? new Anime(this.client, rawData) : undefined
  }

  public async getCharacters (animeID: number): Promise<Array<AnimeCharacterReference> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/characters`)

    return rawData ? rawData.map((characterReference: any) => new AnimeCharacterReference(this.client, animeID, characterReference)) : undefined
  }

  public async getStaff (animeID: number): Promise<Array<AnimeStaffReference> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/staff`)

    return rawData ? rawData.map((staffReference: any) => new AnimeStaffReference(this.client, animeID, staffReference)) : undefined
  }

  public async getEpisodes (animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimePartialEpisode> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeID}/episodes`, offset, maxCount)

    return rawData ? rawData.map((partialEpisode) => new AnimePartialEpisode(this.client, animeID, partialEpisode)) : undefined
  }

  public async getEpisode (animeID: number, episodeID: number): Promise<AnimeEpisode | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/episodes/${episodeID}`)

    return rawData ? new AnimeEpisode(this.client, animeID, rawData) : undefined
  }

  public async getNews (animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeTopic> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeID}/news`, offset, maxCount)

    return rawData ? rawData.map((news) => new AnimeNews(this.client, animeID, news)) : undefined
  }

  public async getTopics (animeID: number, topic: 'all' | 'episode' | 'other' = 'all'): Promise<Array<AnimeTopic> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/forum`, { topic })

    return rawData ? rawData.map((topic: any) => new AnimeTopic(this.client, animeID, topic)) : undefined
  }

  public async getVideos (animeID: number): Promise<AnimeVideo | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/videos`)

    return rawData ? new AnimeVideo(this.client, animeID, rawData) : undefined
  }

  public async getPictures (animeID: number): Promise<Array<Image> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/pictures`)

    return rawData ? rawData.map((picture: any) => new Image(this.client, picture)) : undefined
  }

  public async getStatistics (animeID: number): Promise<AnimeStatistics | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/statistics`)

    return rawData ? new AnimeStatistics(this.client, animeID, rawData) : undefined
  }

  public async getMoreInfo (animeID: number): Promise<string | null | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/moreinfo`)

    return rawData ? rawData.moreinfo || null : undefined
  }

  public async getRecommendations (animeID: number): Promise<Array<AnimeRecommendation> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/recommendations`)

    return rawData ? rawData.map((recommendation: any) => new AnimeRecommendation(this.client, animeID, recommendation)) : undefined
  }

  public async getUserUpdates (animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeUserUpdate> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeID}/userupdates`, offset, maxCount)

    return rawData ? rawData.map((userUpdate: any) => new AnimeUserUpdate(this.client, animeID, userUpdate)) : undefined
  }

  public async getReviews (animeID: number, offset?: number, maxCount?: number): Promise<Array<AnimeReview> | undefined> {
    const rawData = await this.requestPaginatedResource(`anime/${animeID}/reviews`, offset, maxCount)

    return rawData ? rawData.map((review: any) => new AnimeReview(this.client, animeID, review)) : undefined
  }

  public async getRelations (animeID: number): Promise<Array<AnimeRelationGroup<ContentRelationType>> | undefined> {
    const rawData = await this.requestResource(`anime/${animeID}/relations`)

    return rawData ? rawData.map((relation: any) => new AnimeRelationGroup(this.client, animeID, AnimeRelationGroup.parseRelation(relation.relation), relation)) : undefined
  }

  public async getThemes (animeID: number): Promise<{
    openings: Array<string>
    endings: Array<string>
  } | undefined> {
    return await this.requestResource(`anime/${animeID}/themes`)
  }
}
