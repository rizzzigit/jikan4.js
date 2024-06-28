import { Client } from '../../core/client'
import {
  Content,
  ContentRelationType,
  ContentRelationGroup,
  ContentStatistics,
  ContentNews,
  ContentUserUpdate,
  ContentReview,
  ContentExternal
} from './base'
import { BaseClass, BaseResource } from '../base'
import { YoutubeVideo, Link, ImageFormatCollection } from '../misc'
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

export type AnimeType = 'TV' | 'OVA' | 'Movie' | 'Special' | 'ONA' | 'Music' | 'CM' |  'PV' | 'TV Special' | 'Unknown'
export type AnimeAirStatus = 'Finished Airing' | 'Airing' | 'Not Yet Aired' | 'Unknown'
export type AnimeRating = 'None' | 'G' | 'PG' | 'PG-13+' | 'R-17+' | 'R+' | 'Rx' | 'Unknown'
export type AnimeSeason = 'Summer' | 'Winter' | 'Spring' | 'Fall' | 'Unknown'

export class AnimeAirInformation extends BaseClass {
  /** @hidden */
  public static parseStatus (input: any): AnimeAirStatus {
    const status = input?.toLowerCase().trim()

    switch (status) {
      case 'finished airing': return 'Finished Airing'
      case 'currently airing': return 'Airing'
      case 'not yet aired': return 'Not Yet Aired'

      default: return 'Unknown'
    }
  }

  public readonly status: AnimeAirStatus
  public readonly airing: boolean
  public readonly airedFrom: Date | null
  public readonly airedTo: Date | null

  public constructor (client: Client, data: any) {
    super(client)

    this.status = AnimeAirInformation.parseStatus(data.status)
    this.airing = !!data.airing
    this.airedFrom = AnimeAirInformation.parseDate(data.aired.from, true)
    this.airedTo = AnimeAirInformation.parseDate(data.aired.to, true)
  }
}

export class Anime extends Content {
  /** @hidden */
  public static parseType (input: any): AnimeType {
    switch (input?.toLowerCase().trim()) {
      case 'tv': return 'TV'
      case 'ova': return 'OVA'
      case 'movie': return 'Movie'
      case 'special': return 'Special'
      case 'ona': return 'ONA'
      case 'music': return 'Music'
      case 'cm': return 'CM'
      case 'pv': return 'PV'
      case 'tv special': return 'TV Special'

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

  public readonly trailer: YoutubeVideo | null
  public readonly type: AnimeType
  public readonly source: string | null
  public readonly episodes: number | null
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
  public readonly broadcast: AnimeBroadcast | null

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
    return <Promise<Array<ImageFormatCollection>>> this.client.anime.getPictures(this.id)
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

    this.trailer = data.trailer ? new YoutubeVideo(client, data.trailer) : null
    this.type = Anime.parseType(data.type)
    this.source = data.source || null
    this.episodes = data.episodes ?? null
    this.airInfo = new AnimeAirInformation(client, data)
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
    this.broadcast = new AnimeBroadcast(client, data.broadcast)
  }
}

export class AnimeBroadcast extends BaseClass {
  public readonly day?: string
  public readonly time?: string
  public readonly timezone?: string
  public readonly string?: string

  public constructor (client: Client, data: any) {
    super(client)

    this.day = data.day
    this.time = data.time
    this.timezone = data.timezone
    this.string = data.string
  }
}

export class AnimeVoiceActorReference extends BaseClass {
  public readonly language: string
  public readonly person: PersonMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.language = data.language
    this.person = new PersonMeta(client, data.person)
  }
}

export class AnimeCharacterReference extends BaseClass {
  public readonly role: string
  public readonly character: CharacterMeta
  public readonly voiceActors: Array<AnimeVoiceActorReference>

  public constructor (client: Client, data: any) {
    super(client)

    this.role = data.role
    this.character = new CharacterMeta(client, data.character)
    this.voiceActors = data.voice_actors?.map((voiceActor: any) => new AnimeVoiceActorReference(this.client, voiceActor)) || []
  }
}

export class AnimeStaffReference extends BaseClass {
  public readonly positions: Array<string>
  public readonly person: PersonMeta

  public constructor (client: Client, data: any) {
    super(client)

    this.positions = data.positions.filter((position: any) => !!position)
    this.person = new PersonMeta(client, data.person)
  }
}

export class AnimeEpisodeTitle extends BaseClass {
  public readonly default: string
  public readonly japanese: string | null
  public readonly romanji: string | null

  public toString () {
    return this.default
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.default = data.title
    this.japanese = data.japanese || null
    this.romanji = data.romanji || null
  }
}

export class AnimeEpisode extends BaseClass {
  public readonly animeId: number
  public readonly episodeId: number
  public readonly URL: URL | null
  public readonly title: AnimeEpisodeTitle
  public readonly duration: number
  public readonly aired: Date | null
  public readonly filler: boolean
  public readonly recap: boolean
  public readonly synopsis: string | null

  public constructor (client: Client, animeId: number, data: any) {
    super(client)

    this.animeId = animeId
    this.episodeId = data.mal_id
    this.URL = AnimeEpisode.parseURL(data.url, true)
    this.title = new AnimeEpisodeTitle(client, data)
    this.duration = data.duration || null
    this.aired = data.aired ? new Date(data.aired) : null
    this.filler = !!data.filler
    this.recap = !!data.recap
    this.synopsis = data.synopsis || null
  }
}

export class AnimePartialEpisode extends AnimeEpisode {
  public readonly synopsis: null
  public readonly forumUrl: URL | null

  public getFullEpisode () {
    return <Promise<AnimeEpisode>> this.client.anime.getEpisode(this.animeId, this.episodeId)
  }

  public constructor (client: Client, animeId: number, data: any) {
    super(client, animeId, data)

    this.synopsis = null
    this.forumUrl = AnimePartialEpisode.parseURL(data.forum_url, true)
  }
}

export class AnimeTopic extends BaseResource {
  public readonly title: string
  public readonly date: Date
  public readonly authorUsername: string
  public readonly authorURL: URL
  public readonly comments: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.title = data.title
    this.date = new Date(data.date)
    this.authorUsername = data.author_username
    this.authorURL = AnimeTopic.parseURL(data.author_url)
    this.comments = data.comments
  }
}

export class AnimePromo extends BaseClass {
  public readonly title: string
  public readonly trailer: YoutubeVideo

  public constructor (client: Client, data: any) {
    super(client)

    this.title = data.title
    this.trailer = new YoutubeVideo(client, data.trailer)
  }
}

export class AnimeEpisodeVideo extends BaseResource {
  public readonly title: string
  public readonly episode: number
  public readonly image: ImageFormatCollection | null

  public constructor (client: Client, data: any) {
    super(client, data)

    this.title = data.title
    this.episode = typeof (data.episode) === 'string' ? Number(data.episode.toLowerCase().split('episode')[1]?.trim()) || 0 : 0
    this.image = data.images != null ? new ImageFormatCollection(client, data.images) : null
  }
}

export class AnimeMusicVideo extends BaseClass {
  public constructor (client: Client, data: any) {
    super(client)

    this.title = data.title
    this.video = new YoutubeVideo(client, data.video)
    this.meta = data.meta
  }

  public readonly title: string
  public readonly video: YoutubeVideo
  public readonly meta: {
    title: string
    author: string
  }
}

export class AnimeVideo extends BaseClass {
  public readonly promos: Array<AnimePromo>
  public readonly episodes: Array<AnimeEpisodeVideo>
  public readonly musicVideos: Array<AnimeMusicVideo>

  public constructor (client: Client, data: any) {
    super(client)

    this.promos = data.promo?.map((promo: any) => new AnimePromo(this.client, promo)) || []
    this.episodes = data.episodes?.map((episodeVideo: any) => new AnimeEpisodeVideo(this.client, episodeVideo)) || []
    this.musicVideos = data.music_videos?.map((musicVideo: any) => new AnimeMusicVideo(client, musicVideo)) || []
  }
}

export class AnimeStatistics extends ContentStatistics {
  public readonly watching: number
  public readonly planToWatch: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.watching = data.watching
    this.planToWatch = data.plan_to_watch
  }
}

export class AnimeRecommendation extends BaseClass {
  public readonly entry: AnimeMeta
  public readonly URL: URL | null
  public readonly votes: number

  public constructor (client: Client, data: any) {
    super(client)

    this.entry = new AnimeMeta(client, data.entry)
    this.URL = AnimeRecommendation.parseURL(data.url)
    this.votes = data.votes
  }
}

export class AnimeUserUpdate extends ContentUserUpdate {
  public readonly episodesSeen: number
  public readonly episodesTotal: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.episodesSeen = data.episodes_seen
    this.episodesTotal = data.episodes_total
  }
}

export class AnimeReview extends ContentReview {
  public readonly episodesWatched: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.episodesWatched = data.episodes_watched || 0
  }
}

export class AnimeRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
  public readonly items: T extends 'Adaptation' ? Array<MangaMeta> : Array<AnimeMeta>

  public constructor (client: Client, relation: T, data: any) {
    super(client, relation)

    this.items = data.entry?.map((item: any) => new (this.relation === 'Adaptation' ? MangaMeta : AnimeMeta)(this.client, item)) || []
  }
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

    this.relations = data.relations?.map((relation: any) => new AnimeRelationGroup(this.client, AnimeRelationGroup.parseRelation(relation.relation), relation)) || []
    this.themeSongs = data.theme || data.theme_songs || []
    this.external = data.external?.map((external: any) => new ContentExternal(client, external))
    this.streamingLinks = data.streaming
  }
}
