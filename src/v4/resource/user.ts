import { Client } from '../core/client'
import { BaseClass } from './base'
import { AnimeMeta, CharacterMeta, ClubMeta, MangaMeta, PersonMeta } from './meta'
import { ImageFormatCollection, Link } from './misc'

export type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary'

export class UserMeta extends BaseClass {
  public readonly username: string
  public readonly url: URL
  public readonly image: ImageFormatCollection | null
  public readonly lastOnline: Date | null

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.username
    this.url = UserMeta.parseURL(data.url)
    this.image = data.images != null ? new ImageFormatCollection(client, data.images) : null
    this.lastOnline = UserMeta.parseDate(data.last_online)
  }
}

export class User extends BaseClass {
  public static parseGender (input: any): UserGender {
    switch (input?.trim?.().toLowerCase() || '') {
      case 'any': return 'Any'
      case 'male': return 'Male'
      case 'female': return 'Female'
      case 'nonbinary':
      default: return 'Non-binary'
    }
  }

  public readonly username: string
  public readonly url: URL
  public readonly image: ImageFormatCollection | null
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
    this.image = data.images != null ? new ImageFormatCollection(client, data.images) : null
    this.lastOnline = User.parseDate(data.last_online, true)
    this.gender = User.parseGender(data.gender)
    this.birthday = User.parseDate(data.birthday, true)
    this.location = data.location || null
    this.joined = User.parseDate(data.joined, true)
  }
}

export class UserStats extends BaseClass {
  public readonly anime: {
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

  public readonly manga: {
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

  public constructor (client: Client, data: any) {
    super(client)

    this.anime = {
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
    }
    this.manga = {
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

export class UserFavorites extends BaseClass {
  public readonly anime: Array<AnimeMeta>
  public readonly manga: Array<MangaMeta>
  public readonly characters: Array<CharacterMeta>
  public readonly people: Array<PersonMeta>

  public constructor (client: Client, data: any) {
    super(client)

    this.anime = data.anime?.map((anime: any) => new AnimeMeta(client, anime)) || []
    this.manga = data.manga?.map((manga: any) => new MangaMeta(client, manga)) || []
    this.characters = data.characters?.map((character: any) => new CharacterMeta(client, character)) || []
    this.people = data.people?.map((person: any) => new PersonMeta(client, person)) || []
  }
}

export class UserContentUpdate extends BaseClass {
  public readonly score: number
  public readonly status: string
  public readonly date: Date

  public constructor (client: Client, data: any) {
    super(client)

    this.score = data.score
    this.status = data.status
    this.date = UserContentUpdate.parseDate(data.date)
  }
}

export class UserAnimeUpdate extends UserContentUpdate {
  public readonly anime: AnimeMeta
  public readonly episodesSeen: number
  public readonly episodesTotal: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = new AnimeMeta(client, data.entry)
    this.episodesSeen = data.episodes_seen
    this.episodesTotal = data.episodes_total
  }
}

export class UserMangaUpdate extends UserContentUpdate {
  public readonly manga: MangaMeta
  public readonly chaptersRead: number
  public readonly chaptersTotal: number
  public readonly volumesRead: number
  public readonly volumesTotal: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.manga = new MangaMeta(client, data.entry)
    this.chaptersRead = data.chapters_read
    this.chaptersTotal = data.chapters_total
    this.volumesRead = data.volumes_read
    this.volumesTotal = data.volumes_total
  }
}

export class UserContentUpdates extends BaseClass {
  public readonly anime: Array<UserAnimeUpdate>
  public readonly manga: Array<UserMangaUpdate>

  public constructor (client: Client, data: any) {
    super(client)

    this.anime = data.anime?.map((anime: any) => new UserAnimeUpdate(client, anime)) || []
    this.manga = data.manga?.map((manga: any) => new UserMangaUpdate(client, manga)) || []
  }
}

export class UserAnimeHistory extends BaseClass {
  public readonly anime: AnimeMeta
  public readonly increment: number
  public readonly date: Date

  public constructor (client: Client, data: any) {
    super(client)

    this.anime = new AnimeMeta(client, data.entry)
    this.increment = data.increment
    this.date = UserAnimeHistory.parseDate(data.date)
  }
}

export class UserMangaHistory extends BaseClass {
  public readonly manga: MangaMeta
  public readonly increment: number
  public readonly date: Date

  public constructor (client: Client, data: any) {
    super(client)

    this.manga = new MangaMeta(client, data.entry)
    this.increment = data.increment
    this.date = UserMangaHistory.parseDate(data.date)
  }
}

export class UserFriend extends BaseClass {
  public readonly username: string
  public readonly url: URL
  public readonly image: ImageFormatCollection | null
  public readonly lastOnline: Date | null
  public readonly friendsSince: Date | null

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.user.username
    this.url = UserFriend.parseURL(data.user.url)
    this.image = data.images != null ? new ImageFormatCollection(client, data.images) : null
    this.lastOnline = UserFriend.parseDate(data.last_online, true)
    this.friendsSince = UserFriend.parseDate(data.friends_since, true)
  }
}

export class UserRecommendation extends BaseClass {
  public readonly user: {
    url: URL
    username: string
  }

  public readonly entries: Array<(AnimeMeta | MangaMeta) & { images: ImageFormatCollection }>
  public readonly content: string

  public constructor (client: Client, data: any) {
    super(client)

    this.user = {
      url: UserRecommendation.parseURL(data.user.url),
      username: data.user.username
    }

    this.entries = data?.entry?.map((entry: any) => {
      if (entry.url.split('/')[3] === 'anime') {
        return new AnimeMeta(client, entry)
      } else {
        return new MangaMeta(client, entry)
      }
    }) || []
    this.content = data.content
  }
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

    this.statistics = new UserStats(client, data.statistics)
    this.external = data.external?.map((data: any) => Object.assign(data, { url: new URL(data.url) })) || []
    this.updates = {
      manga: data.updates?.manga?.map((update: any) => new UserMangaUpdate(client, update)) || [],
      anime: data.updates?.anime?.map((update: any) => new UserAnimeUpdate(client, update)) || []
    }
  }
}
