import { Client } from '../core/client'
import { ContentImage } from '../resource/content/base'
import { BaseClass } from './base'
import { AnimeMeta, CharacterMeta, ClubMeta, MangaMeta, PersonMeta } from './meta'
import { Link } from './misc'

export type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary'

export class UserMeta extends BaseClass {
  public readonly username: string
  public readonly url: string
  public readonly imageUrl: string | null
  public readonly lastOnline: Date | null

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.username
    this.url = UserMeta.parseURL(data.url)
    this.imageUrl = UserMeta.parseURL(data?.images?.jpg?.image_url, true)
    this.lastOnline = UserMeta.parseDate(data.last_online)
  }
}

export class User extends BaseClass {
  /** @hidden */
  public static parseGender (input: any): UserGender {
    switch (input?.trim?.().toLowerCase() || '') {
      case 'any': return 'Any'
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'nonbinary':
      default: return 'Non-binary'
    }
  }

  /** @hidden */
  public static parseStats (data: any): UserStats {
    return {
      anime: {
        daysWatched: data.anime.days_watched,
        meanScore: data.anime.mean_score,
        watching: data.anime.watching,
        completed: data.anime.completed,
        onHold: data.anime.on_hold,
        dropped: data.anime.dropped,
        planToWatch: data.anime.plan_to_watch,
        totalEntries: data.anime.total_entries,
        rewatched: data.anime.rewatched,
        episodesWatched: data.anime.episodes_watched
      },
      manga: {
        daysRead: data.manga.days_read,
        meanScore: data.manga.mean_score,
        reading: data.manga.reading,
        completed: data.manga.completed,
        onHold: data.manga.on_hold,
        dropped: data.manga.dropped,
        planToRead: data.manga.plan_to_read,
        totalEntries: data.manga.total_entries,
        reread: data.manga.reread,
        chaptersRead: data.manga.chapters_read,
        volumesRead: data.manga.volumes_read
      }
    }
  }

  /** @hidden */
  public static parseFavorites (client: Client, data: any): UserFavorites {
    return {
      anime: data.anime?.map((anime: any) => Object.assign(new AnimeMeta(client, anime), { images: new ContentImage(client, anime.images) })) ?? [],
      manga: data.manga?.map((manga: any) => Object.assign(new MangaMeta(client, manga), { images: new ContentImage(client, manga.images) })) ?? [],
      characters: data.characters?.map((character: any) => Object.assign(new CharacterMeta(client, character), { images: new ContentImage(client, character.images) })) ?? [],
      people: data.people?.map((person: any) => Object.assign(new PersonMeta(client, person), { images: new ContentImage(client, person.images) })) ?? []
    }
  }

  /** @hidden */
  public static parseContentUpdate (data: any): UserContentUpdate {
    return {
      score: data.score,
      status: data.status,
      date: this.parseDate(data.date)
    }
  }

  /** @hidden */
  public static parseAnimeUpdate (client: Client, data: any): UserAnimeUpdate {
    return {
      anime: new AnimeMeta(client, data.entry),
      episodesSeen: data.episodes_seen,
      episodesTotal: data.episodes_total
    }
  }

  /** @hidden */
  public static parseMangaUpdate (client: Client, data: any): UserMangaUpdate {
    return {
      ...this.parseContentUpdate(data),

      manga: new MangaMeta(client, data.entry),
      chaptersRead: data.chapters_read,
      chaptersTotal: data.chapters_total,
      volumesRead: data.volumes_read,
      volumesTotal: data.volumes_total
    }
  }

  /** @hidden */
  public static parseContentUpdates (client: Client, data: any): UserContentUpdates {
    return {
      anime: data.anime?.map((anime: any) => this.parseAnimeUpdate(client, anime)) || [],
      manga: data.manga?.map((manga: any) => this.parseMangaUpdate(client, manga)) || []
    }
  }

  /** @hidden */
  public static parseAnimeHistory (client: Client, data: any): UserAnimeHistory {
    return {
      anime: new AnimeMeta(client, data.entry),
      increment: data.increment,
      date: this.parseDate(data.date)
    }
  }

  /** @hidden */
  public static parseMangaHistory (client: Client, data: any): UserMangaHistory {
    return {
      manga: new MangaMeta(client, data.entry),
      increment: data.increment,
      date: this.parseDate(data.date)
    }
  }

  /** @hidden */
  public static parseRecommendation (client: Client, data: any): UserRecommendation {
    return {
      user: {
        url: this.parseURL(data.user.url),
        username: data.user.username
      },

      entries: Object.assign(((entry) => entry?.map((entry: any) => {
        if (entry.url.split('/')[3] === 'anime') {
          return new AnimeMeta(client, entry)
        } else {
          return new MangaMeta(client, entry)
        }
      }) || [])(data.entry), { images: new ContentImage(client, data.entry.images) }),

      content: data.content
    }
  }

  public readonly username: string
  public readonly url: string
  public readonly imageUrl: string | null
  public readonly lastOnline: Date | null
  public readonly gender: UserGender
  public readonly birthday: Date | null
  public readonly location: string | null
  public readonly joined: Date | null

  public getStatistics () {
    return <Promise<UserStats>> this.client.users.getStatistics(this.username)
  }

  public getFavorites () {
    return <Promise<UserFavorites>> this.client.users.getFavorites(this.username)
  }

  public getUpdates () {
    return <Promise<UserContentUpdates>> this.client.users.getUpdates(this.username)
  }

  public getAbout () {
    return <Promise<string | null>> this.client.users.getAbout(this.username)
  }

  public getHistory (type?: 'anime' | 'manga' | 'all') {
    return <Promise<Array<UserAnimeHistory | UserMangaHistory>>> this.client.users.getHistory(this.username, type)
  }

  public getFriends (offset?: number, maxCount?: number) {
    return <Promise<Array<UserFriend>>> this.client.users.getFriends(this.username, offset, maxCount)
  }

  public getRecommendations (offset?: number, maxCount?: number) {
    return <Promise<Array<UserRecommendation>>> this.client.users.getRecommendations(this.username, offset, maxCount)
  }

  public getClubs (offset?: number, maxCount?: number) {
    return <Promise<Array<ClubMeta>>> this.client.users.getClubs(this.username, offset, maxCount)
  }

  public getExternal () {
    return <Promise<Array<Link>>> this.client.users.getExternal(this.username)
  }

  public getFull () {
    return <Promise<UserFull>> this.client.users.getFull(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.username
    this.url = User.parseURL(data.url)
    this.imageUrl = User.parseURL(data?.images?.jpg?.image_url, true)
    this.lastOnline = User.parseDate(data.last_online, true)
    this.gender = User.parseGender(data.gender)
    this.birthday = User.parseDate(data.birthday, true)
    this.location = data.location || null
    this.joined = User.parseDate(data.joined, true)
  }
}

export interface UserStats {
  readonly anime: {
    daysWatched: number
    meanScore: number
    watching: number
    completed: number
    onHold: number
    dropped: number
    planToWatch: number
    totalEntries: number
    rewatched: number
    episodesWatched: number
  }

  readonly manga: {
    daysRead: number
    meanScore: number
    reading: number
    completed: number
    onHold: number
    dropped: number
    planToRead: number
    totalEntries: number
    reread: number
    chaptersRead: number
    volumesRead: number
  }
}

export interface UserFavorites {
  readonly anime: Array<AnimeMeta & { images: ContentImage }>
  readonly manga: Array<MangaMeta & { images: ContentImage }>
  readonly characters: Array<CharacterMeta & { images: ContentImage }>
  readonly people: Array<PersonMeta & { images: ContentImage }>
}

export interface UserContentUpdate {
  readonly score: number
  readonly status: string
  readonly date: Date
}

export interface UserAnimeUpdate {
  readonly anime: AnimeMeta
  readonly episodesSeen: number
  readonly episodesTotal: number
}

export interface UserMangaUpdate extends UserContentUpdate {
  readonly manga: MangaMeta
  readonly chaptersRead: number
  readonly chaptersTotal: number
  readonly volumesRead: number
  readonly volumesTotal: number
}

export interface UserContentUpdates {
  readonly anime: Array<UserAnimeUpdate>
  readonly manga: Array<UserMangaUpdate>
}

export interface UserAnimeHistory {
  readonly anime: AnimeMeta
  readonly increment: number
  readonly date: Date
}

export interface UserMangaHistory {
  readonly manga: MangaMeta
  readonly increment: number
  readonly date: Date
}

export class UserFriend extends BaseClass {
  public readonly username: string
  public readonly url: string
  public readonly imageUrl: string | null
  public readonly lastOnline: Date | null
  public readonly friendsSince: Date | null

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.user.username
    this.url = UserFriend.parseURL(data.user.url)
    this.imageUrl = UserFriend.parseURL(data.user.images?.jpg?.image_url, true)
    this.lastOnline = UserFriend.parseDate(data.last_online, true)
    this.friendsSince = UserFriend.parseDate(data.friends_since, true)
  }
}

export interface UserRecommendation {
  readonly user: {
    url: string
    username: string
  }

  readonly entries: Array<(AnimeMeta | MangaMeta) & { images: ContentImage }>
  readonly content: string
}

export class UserFull extends User {
  public readonly statistics: UserStats
  public readonly external: Array<Link>
  public readonly updates: {
    manga: UserMangaUpdate,
    anime: UserAnimeUpdate
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.statistics = User.parseStats(data.statistics)
    this.external = data.external.map((data: any) => Object.assign(data, { url: new URL(data.url) }))
    this.updates = {
      manga: data.updates?.manga?.map((update: any) => User.parseMangaUpdate(client, update)) || [],
      anime: data.updates?.anime?.map((update: any) => User.parseAnimeUpdate(client, update)) || []
    }
  }
}
