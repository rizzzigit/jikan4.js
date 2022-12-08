import { BaseManager } from '../manager/base'
import { ContentExternal, ContentNews, ContentRelationType } from '../resource/content/base'
import {
  Anime,
  AnimeCharacterReference,
  AnimeStaffReference,
  AnimePartialEpisode,
  AnimeEpisode,
  AnimeTopic,
  AnimeVideo,
  AnimeStatistics,
  AnimeRecommendation,
  AnimeUserUpdate,
  AnimeReview,
  AnimeRelationGroup,
  AnimeFull,
  AnimeEpisodeVideo
} from '../resource/content/anime'
import { Image, Link } from '../resource/misc'
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

export interface TopAnimeFilter {
  type: 'tv' | 'movie' | 'ova' | 'special' | 'ona' | 'music'
  filter: 'airing' | 'upcoming' | 'bypopularity' | 'favorite'
}

export class AnimeManager extends BaseManager {
  public async search (searchString: string, filter?: Partial<AnimeSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('anime', offset, maxCount, {
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'score': return [key, `${value}`]
          case 'minScore': return ['min_score', `${value}`]
          case 'maxScore': return ['max_score', `${value}`]
          case 'sfw': return [key, '']
          case 'genres': return [key, `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.id : value)}`]
          case 'excludeGenres': return ['genres_exclude', `${(<Array<any>> value).map((value: any) => value instanceof AnimeGenreMeta ? value.id : value)}`]
          case 'producers': return [key, `${(<Array<any>> value).map((value: any) => value instanceof ProducerMeta ? value.id : value)}`]
          case 'orderBy': return ['order_by', `${value}`]
          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((anime) => anime).map((anime) => new Anime(this.client, anime))
  }

  public async list (offset?: number, maxCount?: number): Promise<Array<Anime>> {
    const rawData = <Array<any>> await this.requestPaginated('anime', offset, maxCount)

    return rawData.map((anime: any) => new Anime(this.client, anime))
  }

  public async listTop (filter?: Partial<TopAnimeFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('top/anime', offset, maxCount, { ...filter })

    return rawData.map((anime: any) => new Anime(this.client, anime))
  }

  public async listRecommended (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('recommendations/anime', offset, maxCount)

    return rawData.map((anime: any) => new Anime(this.client, anime))
  }

  public async listScheduled (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('schedules', offset, maxCount)

    return rawData.map((anime: any) => new Anime(this.client, anime))
  }

  public async random (sfw?: boolean): Promise<Anime> {
    const rawData = await this.request('random/anime', { disableCaching: 'true', sfw: sfw ? 'true' : '' })

    return new Anime(this.client, rawData)
  }

  public async get (animeId: number): Promise<Anime | undefined> {
    const rawData = await this.request(`anime/${animeId}`)

    return rawData ? new Anime(this.client, rawData) : undefined
  }

  public async getFull (animeId: number): Promise<AnimeFull | undefined> {
    const rawData = await this.request(`anime/${animeId}/full`)

    return rawData ? new AnimeFull(this.client, rawData) : undefined
  }

  public async getCharacters (animeId: number): Promise<Array<AnimeCharacterReference> | undefined> {
    const rawData = await this.request(`anime/${animeId}/characters`)

    return rawData ? rawData.map((characterReference: any) => Anime.parseCharacterReference(this.client, characterReference)) : undefined
  }

  public async getStaff (animeId: number): Promise<Array<AnimeStaffReference> | undefined> {
    const rawData = await this.request(`anime/${animeId}/staff`)

    return rawData ? rawData.map((staffReference: any) => Anime.parseStaffReference(this.client, staffReference)) : undefined
  }

  public async getEpisodes (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimePartialEpisode> | undefined> {
    const rawData = await this.requestPaginated(`anime/${animeId}/episodes`, offset, maxCount)

    return rawData ? rawData.map((partialEpisode) => Anime.parsePartialEpisode(Object.assign(partialEpisode, { animeId }))) : undefined
  }

  public async getEpisode (animeId: number, episodeId: number): Promise<AnimeEpisode | undefined> {
    const rawData = await this.request(`anime/${animeId}/episodes/${episodeId}`)

    return rawData ? Anime.parseEpisode(Object.assign(rawData, { animeId })) : undefined
  }

  public async getNews (animeId: number, offset?: number, maxCount?: number): Promise<Array<ContentNews> | undefined> {
    const rawData = await this.requestPaginated(`anime/${animeId}/news`, offset, maxCount)

    return rawData ? rawData.map((news) => Anime.parseNews(news)) : undefined
  }

  public async getTopics (animeId: number, topic: 'all' | 'episode' | 'other' = 'all'): Promise<Array<AnimeTopic> | undefined> {
    const rawData = await this.request(`anime/${animeId}/forum`, { topic })

    return rawData ? rawData.map((topic: any) => Anime.parseTopc(topic)) : undefined
  }

  public async getVideos (animeId: number): Promise<AnimeVideo | undefined> {
    const rawData = await this.request(`anime/${animeId}/videos`)

    return rawData ? Anime.parseVideo(rawData) : undefined
  }

  public async getVideosEpisodes (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeEpisodeVideo> | undefined> {
    const rawData = await this.requestPaginated(`anime/${animeId}/videos/episodes`, offset, maxCount)

    return rawData ? rawData.map((episode) => Anime.parseEpisodeVideo(episode)) : undefined
  }

  public async getPictures (animeId: number): Promise<Array<Image> | undefined> {
    const rawData = await this.request(`anime/${animeId}/pictures`)

    return rawData ? rawData.map((picture: any) => Anime.parseImage(picture)) : undefined
  }

  public async getStatistics (animeId: number): Promise<AnimeStatistics | undefined> {
    const rawData = await this.request(`anime/${animeId}/statistics`)

    return rawData ? Anime.parseStatistics(rawData) : undefined
  }

  public async getMoreInfo (animeId: number): Promise<string | null | undefined> {
    const rawData = await this.request(`anime/${animeId}/moreinfo`)

    return rawData ? rawData.moreinfo || null : undefined
  }

  public async getRecommendations (animeId: number): Promise<Array<AnimeRecommendation> | undefined> {
    const rawData = await this.request(`anime/${animeId}/recommendations`)

    return rawData ? rawData.map((recommendation: any) => Anime.parseRecommendation(this.client, recommendation)) : undefined
  }

  public async getUserUpdates (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeUserUpdate> | undefined> {
    const rawData = await this.requestPaginated(`anime/${animeId}/userupdates`, offset, maxCount)

    return rawData ? rawData.map((userUpdate: any) => Anime.parseUserUpdate(userUpdate)) : undefined
  }

  public async getReviews (animeId: number, offset?: number, maxCount?: number): Promise<Array<AnimeReview> | undefined> {
    const rawData = await this.requestPaginated(`anime/${animeId}/reviews`, offset, maxCount)

    return rawData ? rawData.map((review: any) => Anime.parseReview(review)) : undefined
  }

  public async getRelations (animeId: number): Promise<Array<AnimeRelationGroup<ContentRelationType>> | undefined> {
    const rawData = await this.request(`anime/${animeId}/relations`)

    return rawData ? rawData.map((relation: any) => Anime.parseRelationGroup(this.client, Anime.parseRelationType(relation.relation), relation)) : undefined
  }

  public async getThemes (animeId: number): Promise<{
    openings: Array<string>
    endings: Array<string>
  } | undefined> {
    return await this.request(`anime/${animeId}/themes`)
  }

  public async getExternal (animeId: number): Promise<Array<ContentExternal> | undefined> {
    const rawData = await this.request(`anime/${animeId}/external`)

    return rawData ? rawData.map((external: any) => Anime.parseExternal(external)) : undefined
  }

  public async getStreamingLinks (animeId: number): Promise<Array<Link> | undefined> {
    return await this.request(`anime/${animeId}/streaming`)
  }
}
