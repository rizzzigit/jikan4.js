import { URL } from 'url'
import { Client } from '../core/client'
import { ContentImage } from '../Jikan'
import { BaseClass } from './base'
import { Club } from './club'
import { AnimeMeta, CharacterMeta, MangaMeta, PersonMeta } from './meta'

export type UserGender = 'Any' | 'Male' | 'Female' | 'Non-binary'

export class UserMeta extends BaseClass {
  public readonly username: string
  public readonly url: URL
  public readonly imageUrl: URL | null
  public readonly lastOnline: Date | null

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = UserMeta.parseString(data.username)
    this.url = UserMeta.parseURL(data.url)
    this.imageUrl = UserMeta.parseURL(data?.images?.jpg?.image_url, true)
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
  public readonly imageUrl: URL | null
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
    return <Promise<Array<AnimeMeta | MangaMeta>>> this.client.users.getHistory(this.username, type)
  }

  public getFriends (offset?: number, maxCount?: number) {
    return <Promise<Array<UserFriend>>> this.client.users.getFriends(this.username, offset, maxCount)
  }

  public getRecommendations (offset?: number, maxCount?: number) {
    return <Promise<Array<UserRecommendation>>> this.client.users.getRecommendations(this.username, offset, maxCount)
  }

  public getClubs (offset?: number, maxCount?: number) {
    return <Promise<Array<Club>>> this.client.users.getClubs(this.username, offset, maxCount)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = UserMeta.parseString(data.username)
    this.url = UserMeta.parseURL(data.url)
    this.imageUrl = UserMeta.parseURL(data?.images?.jpg?.image_url, true)
    this.lastOnline = UserMeta.parseDate(data.last_online)
    this.gender = User.parseGender(data.gender)
    this.birthday = User.parseDate(data.birthday, true)
    this.location = data.location || null
    this.joined = User.parseDate(data.joined, true)
  }
}

export class UserStats extends BaseClass {
  public readonly username: string

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

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.anime = {
      daysWatched: data.days_watched,
      meanScore: data.mean_score,
      watching: data.watching,
      completed: data.completed,
      onHold: data.on_hold,
      dropped: data.dropped,
      planToWatch: data.plan_to_watch,
      totalEntries: data.total_entries,
      rewatched: data.rewatched,
      episodesWatched: data.episodes_watched
    }
    this.manga = {
      daysRead: data.days_read,
      meanScore: data.mean_score,
      reading: data.reading,
      completed: data.completed,
      onHold: data.on_hold,
      dropped: data.dropped,
      planToRead: data.plan_to_read,
      totalEntries: data.total_entries,
      reread: data.reread,
      chaptersRead: data.chapters_read,
      volumesRead: data.volumes_read
    }
  }
}

export class UserFavorites extends BaseClass {
  public readonly username: string
  public readonly anime: Array<AnimeMeta & { images: ContentImage }>
  public readonly manga: Array<MangaMeta & { images: ContentImage }>
  public readonly characters: Array<CharacterMeta & { images: ContentImage }>
  public readonly people: Array<PersonMeta & { images: ContentImage }>

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.anime = data.anime.map((anime: any) => Object.assign(new AnimeMeta(client, anime), { images: new ContentImage(client, anime.images) }))
    this.manga = data.manga.map((manga: any) => Object.assign(new MangaMeta(client, manga), { images: new ContentImage(client, manga.images) }))
    this.characters = data.characters.map((character: any) => Object.assign(new CharacterMeta(client, character), { images: new ContentImage(client, character.images) }))
    this.people = data.people.map((person: any) => Object.assign(new PersonMeta(client, person), { images: new ContentImage(client, person.images) }))
  }
}

export class UserContentUpdate extends BaseClass {
  public readonly username: string
  public readonly score: number
  public readonly status: string
  public readonly date: Date

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.score = data.score
    this.status = data.status
    this.date = UserContentUpdate.parseDate(data.date)
  }
}

export class UserAnimeUpdate extends UserContentUpdate {
  public readonly anime: AnimeMeta
  public readonly episodesSeen: number
  public readonly episodesTotal: number

  public constructor (client: Client, username: string, data: any) {
    super(client, username, data)

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

  public constructor (client: Client, username: string, data: any) {
    super(client, username, data)

    this.manga = new MangaMeta(client, data)
    this.chaptersRead = data.chapters_read
    this.chaptersTotal = data.chapters_total
    this.volumesRead = data.volumes_read
    this.volumesTotal = data.volumes_total
  }
}

export class UserContentUpdates extends BaseClass {
  public readonly username: string
  public readonly anime: Array<UserAnimeUpdate>
  public readonly manga: Array<UserMangaUpdate>

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.anime = data.anime.map((anime: any) => new UserAnimeUpdate(client, username, anime))
    this.manga = data.manga.map((manga: any) => new UserMangaUpdate(client, username, manga))
  }
}

export class UserAnimeHistory extends BaseClass {
  public readonly username: string
  public readonly anime: AnimeMeta
  public readonly increment: number
  public readonly date: Date

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.anime = new AnimeMeta(client, data.entry)
    this.increment = data.increment
    this.date = UserAnimeHistory.parseDate(data.date)
  }
}

export class UserMangaHistory extends BaseClass {
  public readonly username: string
  public readonly manga: MangaMeta
  public readonly increment: number
  public readonly date: Date

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, username: string, data: any) {
    super(client)

    this.username = username
    this.manga = new MangaMeta(client, data.entry)
    this.increment = data.increment
    this.date = UserMangaHistory.parseDate(data.date)
  }
}

export class UserFriend extends BaseClass {
  public readonly username: string
  public readonly url: URL
  public readonly imageUrl: URL | null
  public readonly lastOnline: Date
  public readonly friendsSince: Date

  public getUser () {
    return <Promise<User>> this.client.users.get(this.username)
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.user.username
    this.url = UserFriend.parseURL(data.user.url)
    this.imageUrl = UserFriend.parseURL(data.user.images?.jpg?.image_url, true)
    this.lastOnline = UserFriend.parseDate(data.last_online)
    this.friendsSince = UserFriend.parseDate(data.friends_since)
  }
}

export class UserRecommendation extends BaseClass {
  public readonly user: {
    url: URL
    username: string
  }

  public readonly entry: (AnimeMeta | MangaMeta) & { images: ContentImage }
  public readonly id: number
  public readonly content: string

  public constructor (client: Client, data: any) {
    super(client)

    this.user = {
      url: UserRecommendation.parseURL(data.user.data.url),
      username: data.user.data.username
    }

    this.entry = Object.assign(((entry) => {
      if (entry.url.split('/')[3] === 'anime') {
        return new AnimeMeta(client, entry)
      } else {
        return new MangaMeta(client, entry)
      }
    })(data.entry), { images: new ContentImage(client, data.entry.images) })

    this.id = data.mal_id
    this.content = data.content
  }
}
