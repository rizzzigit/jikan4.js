import { Client } from '../../core/client'
import {
  Content,
  ContentRelationType,
  ContentRelationGroup,
  ContentStatistics,
  ContentNews,
  ContentUserUpdate,
  ContentReactions,
  ContentReview,
  ContentExternal
} from './base'
import { YoutubeVideo, Image, Link } from '../misc'
import {
  ProducerMeta,
  AnimeGenreMeta,
  PersonMeta,
  CharacterMeta,
  AnimeMeta,
  MangaMeta
} from '../meta'
import ParseDuration from 'parse-duration'
import { animeExplicitGenres } from '../../manager/genre'

export type AnimeType = 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | 'Unknown'
export type AnimeAirStatus = 'FinishedAiring' | 'Airing' | 'NotYetAired' | 'Unknown'
export type AnimeRating = 'None' | 'G' | 'PG' | 'PG-13+' | 'R-17+' | 'R+' | 'Rx' | 'Unknown'
export type AnimeSeason = 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'Unknown'

export interface AnimeAirInformation {
  readonly status: AnimeAirStatus
  readonly airing: boolean
  readonly airedFrom: Date | null
  readonly airedTo: Date | null
}

export class Anime extends Content {
  /** @hidden */
  public static parseAirInfo (data: any): AnimeAirInformation {
    return {
      status: this.parseAirInfoStatus(data.status),
      airing: data.airing,
      airedFrom: this.parseDate(data.aired.from, true),
      airedTo: this.parseDate(data.aired.to, true)
    }
  }

  /** @hidden */
  public static parseAirInfoStatus (input: any): AnimeAirStatus {
    const status = input?.toLowerCase().trim()

    switch (status) {
      case 'finished airing': return 'FinishedAiring'
      case 'currently airing': return 'Airing'
      case 'not yet aired': return 'NotYetAired'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseType (input: any): AnimeType {
    switch (input?.toLowerCase().trim()) {
      case 'tv': return 'TV'
      case 'ova': return 'OVA'
      case 'movie': return 'Movie'
      case 'special': return 'Special'
      case 'ona': return 'ONA'
      case 'music': return 'Music'

      case 'unknow':
      case 'unknown':
      case '-':
      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseRating (input: any): AnimeRating {
    switch (input?.toLowerCase().trim()) {
      case 'none': return 'None'
      case 'g - all ages': return 'G'
      case 'pg - childre': return 'PG'
      case 'pg - children': return 'PG'
      case 'pg-13 - teens 13 or older': return 'PG-13+'
      case 'r - 17+ (violence & profanity)': return 'R-17+'
      case 'r+ - mild nudity': return 'R+'
      case 'rx - hentai': return 'Rx'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseSeason (input: any): AnimeSeason | null {
    switch (input) {
      case 'summer': return 'Summer'
      case 'winter': return 'Winter'
      case 'spring': return 'Spring'
      case 'fall': return 'Fall'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseVoiceActorReference (client: Client, data: any): AnimeVoiceActorReference {
    return {
      language: data.language,
      person: new PersonMeta(client, data.person)
    }
  }

  /** @hidden */
  public static parseCharacterReference (client: Client, data: any): AnimeCharacterReference {
    return {
      role: data.role,
      character: new CharacterMeta(client, data.character),
      voiceActors: data.voice_actors?.map((entry: any) => this.parseVoiceActorReference(client, entry))
    }
  }

  /** @hidden */
  public static parseStaffReference (client: Client, data: any): AnimeStaffReference {
    return {
      positions: data.positions.filter((position: any) => !!position),
      person: new PersonMeta(client, data.person)
    }
  }

  /** @hidden */
  public static parseEpisodeTitle (data: any): AnimeEpisodeTitle {
    return {
      default: data.title,
      japanese: data.japanese || null,
      romanji: data.romanji || null,

      toString: () => data.title
    }
  }

  /** @hidden */
  public static parseEpisode (data: any): AnimeEpisode {
    return {
      animeId: data.animeId,
      episodeId: data.mal_id,
      URL: Anime.parseURL(data.url, true),
      title: Anime.parseEpisodeTitle(data),
      duration: data.duration || null,
      aired: data.aired ? new Date(data.aired) : null,
      filler: data.filler,
      recap: data.recap,
      synopsis: data.synopsis || null
    }
  }

  /** @hidden */
  public static parsePartialEpisode (data: any): AnimePartialEpisode {
    return Object.assign(this.parseEpisode(data), {
      synopsis: null,
      forumUrl: Anime.parseURL(data.forum_url, true)
    })
  }

  /** @hidden */
  public static parseTopc (data: any): AnimeTopic {
    return {
      id: data.mal_id,
      url: Anime.parseURL(data.url),
      title: data.title,
      date: new Date(data.date),
      authorUsername: data.author_username,
      authorURL: data.author_url,
      comments: data.comments
    }
  }

  /** @hidden */
  public static parsePromo (data: any): AnimePromo {
    return {
      title: data.title,
      trailer: Anime.parseYoutubeVideo(data.trailer)
    }
  }

  /** @hidden */
  public static parseEpisodeVideo (data: any): AnimeEpisodeVideo {
    return {
      id: data.mal_id,
      url: data.url,
      title: data.title,
      episode: typeof (data.episode) === 'string' ? Number(data.episode.toLowerCase().split('episode')[1]?.trim()) || 0 : 0,
      imageURL: Anime.parseURL(data.images?.jpg?.image_url, true)
    }
  }

  /** @hidden */
  public static parseMusicVideo (data: any): AnimeMusicVideo {
    return {
      title: data.title,
      video: this.parseYoutubeVideo(data.video),
      meta: data.meta
    }
  }

  /** @hidden */
  public static parseVideo (data: any): AnimeVideo {
    return {
      promos: data.promo?.map((promo: any) => this.parsePromo(promo)) ?? [],
      episodes: data.episodes?.map((episode: any) => this.parseEpisodeVideo(episode)) ?? [],
      musicVideos: data.music_videos?.map((musicVideo: any) => this.parseMusicVideo(musicVideo)) ?? []
    }
  }

  /** @hidden */
  public static parseStatistics (data: any): AnimeStatistics {
    return {
      ...super.parseStatistics(data),

      watching: data.watching,
      planToWatch: data.plan_to_watch
    }
  }

  /** @hidden */
  public static parseRecommendation (client: Client, data: any): AnimeRecommendation {
    return {
      entry: new AnimeMeta(client, data.entry),
      URL: this.parseURL(data.url),
      votes: data.votes
    }
  }

  /** @hidden */
  public static parseUserUpdate (data: any): AnimeUserUpdate {
    return {
      ...super.parseUserUpdate(data),
      episodesSeen: data.episodes_seen,
      episodesTotal: data.episodes_total
    }
  }

  /** @hidden */
  public static parseReview (data: any): AnimeReview {
    return {
      ...Anime.parseReview(data),

      episodesWatched: data.episodes_watched
    }
  }

  /** @hidden */
  public static parseTopReview (client: Client, data: any): TopAnimeReview {
    return {
      ...this.parseReview(data),

      anime: new AnimeMeta(client, data.entry)
    }
  }

  /** @hidden */
  public static parseRelationGroup<T extends ContentRelationType> (client: Client, relation: T, data: any): AnimeRelationGroup<T> {
    const a = super.parseRelationGroup(client, relation, data)

    return {
      ...a,
      items: data.entry?.map((item: any) => new (a.relation === 'Adaptation' ? MangaMeta : AnimeMeta)(client, item)) ?? []
    }
  }

  public readonly trailer: YoutubeVideo | null
  public readonly type: AnimeType
  public readonly source: string | null
  public readonly episodes: this['type'] extends 'TV' ? number : null
  public readonly airInfo: AnimeAirInformation

  public readonly duration: number | null
  public readonly rating: AnimeRating
  public readonly season: AnimeSeason | null
  public readonly year: number | null
  public readonly producers: Array<ProducerMeta>
  public readonly licensors: Array<ProducerMeta>
  public readonly studios: Array<ProducerMeta>
  public readonly genres: Array<AnimeGenreMeta<'Genre'>>
  public readonly explicitGenres: Array<AnimeGenreMeta<'Explicit'>>
  public readonly themes: Array<AnimeGenreMeta<'Theme'>>
  public readonly demographics: Array<AnimeGenreMeta<'Demographic'>>

  public get isExplicit (): boolean {
    return !!(
      ['Rx', 'R-17+'].includes(this.rating) ||
      this.genres.find((genre) => !!animeExplicitGenres.find((genreEntry) => genreEntry[0] === genre.id))
    )
  }

  public getCharacters () {
    return <Promise<Array<AnimeCharacterReference>>> this.client.anime.getCharacters(this.id)
  }

  public getStaff () {
    return <Promise<Array<AnimeStaffReference>>> this.client.anime.getStaff(this.id)
  }

  public getEpisodes (offset?: number, maxCount?: number) {
    return <Promise<Array<AnimePartialEpisode>>> this.client.anime.getEpisodes(this.id, offset, maxCount)
  }

  public getEpisode (episodeId: number) {
    return <Promise<AnimeEpisode>> this.client.anime.getEpisode(this.id, episodeId)
  }

  public getNews (offset?: number, maxCount?: number) {
    return <Promise<Array<ContentNews>>> this.client.anime.getNews(this.id, offset, maxCount)
  }

  public getTopics (topic?: 'all' | 'episode' | 'other') {
    return <Promise<Array<AnimeTopic>>> this.client.anime.getTopics(this.id, topic)
  }

  public getVideos () {
    return <Promise<AnimeVideo>> this.client.anime.getVideos(this.id)
  }

  public getVideosEpisodes (offset?: number, maxCount?: number) {
    return <Promise<Array<AnimeEpisodeVideo>>> this.client.anime.getVideosEpisodes(this.id, offset, maxCount)
  }

  public getPictures () {
    return <Promise<Array<Image>>> this.client.anime.getPictures(this.id)
  }

  public getStatistics () {
    return <Promise<AnimeStatistics>> this.client.anime.getStatistics(this.id)
  }

  public getMoreInfo () {
    return <Promise<string | null>> this.client.anime.getMoreInfo(this.id)
  }

  public getRecommendations () {
    return <Promise<Array<AnimeRecommendation>>> this.client.anime.getRecommendations(this.id)
  }

  public getUserUpdates (offset?: number, maxCount?: number) {
    return <Promise<Array<AnimeUserUpdate>>> this.client.anime.getUserUpdates(this.id, offset, maxCount)
  }

  public getReviews (offset?: number, maxCount?: number) {
    return <Promise<Array<AnimeReview>>> this.client.anime.getReviews(this.id, offset, maxCount)
  }

  public getRelations () {
    return <Promise<Array<AnimeRelationGroup<ContentRelationType>>>> this.client.anime.getRelations(this.id)
  }

  public getThemes () {
    return <Promise<{ openings: Array<string>, endings: Array<string> }>> this.client.anime.getThemes(this.id)
  }

  public getExternal () {
    return <Promise<Array<ContentExternal>>> this.client.anime.getExternal(this.id)
  }

  public getStreamingLinks () {
    return <Promise<Array<Link>>> this.client.anime.getStreamingLinks(this.id)
  }

  public getFull () {
    return <Promise<AnimeFull>> this.client.anime.getFull(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.trailer = data.trailer ? Anime.parseYoutubeVideo(data.trailer) : null
    this.type = Anime.parseType(data.type)
    this.source = data.source || null
    this.episodes = data.episodes || null
    this.airInfo = Anime.parseAirInfo(data)
    this.duration = ParseDuration(data.duration, 'millisecond') || null
    this.rating = Anime.parseRating(data.rating)
    this.season = Anime.parseSeason(data.season)
    this.year = data.year || null
    this.producers = data.producers?.map((producer: any) => new ProducerMeta(this.client, producer)) || []
    this.licensors = data.licensors?.map((licensor: any) => new ProducerMeta(this.client, licensor)) || []
    this.studios = data.studios?.map((studio: any) => new ProducerMeta(this.client, studio)) || []
    this.genres = data.genres?.map((genre: any) => new AnimeGenreMeta(this.client, genre, 'Genre')) || []
    this.explicitGenres = data.explicit_genres?.map((genre: any) => new AnimeGenreMeta(this.client, genre, 'Explicit')) || []
    this.demographics = data.demographics?.map((genre: any) => new AnimeGenreMeta(this.client, genre, 'Demographic')) || []
    this.themes = data.themes?.map((genre: any) => new AnimeGenreMeta(this.client, genre, 'Theme')) || []
  }
}

export interface AnimeVoiceActorReference {
  readonly language: string
  readonly person: PersonMeta
}

export interface AnimeCharacterReference {
  readonly role: string
  readonly character: CharacterMeta
  readonly voiceActors: Array<AnimeVoiceActorReference>
}

export interface AnimeStaffReference {
  readonly positions: Array<string>
  readonly person: PersonMeta
}

export interface AnimeEpisodeTitle {
  readonly default: string
  readonly japanese: string | null
  readonly romanji: string | null

  toString (): string
}

export interface AnimeEpisode {
  readonly animeId: number
  readonly episodeId: number
  readonly URL: string | null
  readonly title: AnimeEpisodeTitle
  readonly duration: number
  readonly aired: Date | null
  readonly filler: boolean
  readonly recap: boolean
  readonly synopsis: string | null
}

export interface AnimePartialEpisode extends AnimeEpisode {
  readonly synopsis: null
  readonly forumUrl: string | null
}

export interface AnimeTopic {
  readonly id: number
  readonly url: string
  readonly title: string
  readonly date: Date
  readonly authorUsername: string
  readonly authorURL: string
  readonly comments: number
}

export interface AnimePromo {
  readonly title: string
  readonly trailer: YoutubeVideo
}

export interface AnimeEpisodeVideo {
  readonly id: number,
  readonly url: string | null,
  readonly title: string
  readonly episode: number
  readonly imageURL: string | null
}

export interface AnimeMusicVideo {
  readonly title: string
  readonly video: YoutubeVideo
  readonly meta: {
    title: string
    author: string
  }
}

export interface AnimeVideo {
  readonly promos: Array<AnimePromo>
  readonly episodes: Array<AnimeEpisodeVideo>
  readonly musicVideos: Array<AnimeMusicVideo>
}

export interface AnimeStatistics extends ContentStatistics {
  readonly watching: number
  readonly planToWatch: number
}

export interface AnimeRecommendation {
  entry: AnimeMeta
  URL: string | null
  votes: number
}

export interface AnimeUserUpdate extends ContentUserUpdate {
  readonly episodesSeen: number
  readonly episodesTotal: number
}

export interface AnimeReview extends ContentReview {
  readonly episodesWatched: number
  readonly reactions: ContentReactions
}

export interface TopAnimeReview extends AnimeReview {
  readonly anime: AnimeMeta
}

export interface AnimeRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
  readonly items: T extends 'Adaptation' ? Array<MangaMeta> : Array<AnimeMeta>
}

export class AnimeFull extends Anime {
  public readonly relations: Array<AnimeRelationGroup<ContentRelationType>>
  public readonly themeSongs: {
    optenings: Array<string>
    endings: Array<string>
  }

  public readonly external: Array<ContentExternal>
  public readonly streamingLinks: Array<Link>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.relations = data.relations?.map((relation: any) => Anime.parseRelationGroup(this.client, Anime.parseRelationType(relation.relation), relation)) || []
    this.themeSongs = data.theme || data.theme_songs || []
    this.external = data.external?.map((external: any) => Anime.parseExternal(external))
    this.streamingLinks = data.streaming
  }
}
