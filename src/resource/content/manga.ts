import { Client } from '../../core/client'
import { BaseClass, BaseResource } from '../base'
import {
  Content,
  ContentRelationType,
  ContentRelationGroup,
  ContentNews,
  ContentStatistics,
  ContentUserUpdate,
  ContentReviewScores,
  ContentReview
} from './base'
import {
  PersonMeta,
  MagazineMeta,
  MangaGenreMeta,
  CharacterMeta,
  MangaMeta,
  AnimeMeta
} from '../meta'
import { Image } from '../misc'
import { URL } from 'url'
import { mangaExplicitGenres } from '../../manager/genre'

export type MangaType = 'Manga' | 'Novel' | 'LightNovel' | 'OneShot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown'
export type MangaPublishStatus = 'Finished' | 'Publishing' | 'OnHiatus' | 'Discontinued' | 'NotYetPublished' | 'Unknown'

export class MangaPublishInformation extends BaseClass {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseStatus (input: any): MangaPublishStatus {
    switch (input?.toLowerCase().trim()) {
      case 'finished': return 'Finished'
      case 'publishing': return 'Publishing'
      case 'on hiatus': return 'OnHiatus'
      case 'discontinued': return 'Discontinued'
      case 'not yet published': return 'NotYetPublished'

      default: return 'Unknown'
    }
  }

  public readonly status: MangaPublishStatus
  public readonly publishing: boolean
  public readonly publishedFrom: Date | null
  public readonly publishedTo: Date | null

  public constructor (client: Client, data: any) {
    super(client)

    this.status = MangaPublishInformation.parseStatus(data.status)
    this.publishing = !!data.publishing
    this.publishedFrom = MangaPublishInformation.parseDate(data.published.from, true)
    this.publishedTo = MangaPublishInformation.parseDate(data.published.to, true)
  }
}

export class Manga extends Content {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseType (input: any): MangaType {
    switch (input?.toLowerCase().trim()) {
      case 'manga': return 'Manga'
      case 'novel': return 'Novel'
      case 'light novel': return 'LightNovel'
      case 'one-shot': return 'OneShot'
      case 'doujinshi': return 'Doujinshi'
      case 'manhua': return 'Manhua'
      case 'manhwa': return 'Manhwa'
      case 'oel': return 'OEL'

      default: return 'Unknown'
    }
  }

  public readonly type: MangaType
  public readonly chapters: number
  public readonly volumes: number
  public readonly publishInfo: MangaPublishInformation
  public readonly authors: Array<PersonMeta>
  public readonly serializations: Array<MagazineMeta>
  public readonly genres: Array<MangaGenreMeta<'Genre'>>
  public readonly explicitGenres: Array<MangaGenreMeta<'Explicit'>>
  public readonly themes: Array<MangaGenreMeta<'Theme'>>
  public readonly demographics: Array<MangaGenreMeta<'Demographic'>>

  public get isExplicit (): boolean {
    return !!(this.genres.find((genre) => !!mangaExplicitGenres.find((genreEntry) => genreEntry[0] === genre.id)))
  }

  public getCharacters () {
    return <Promise<Array<MangaCharacterReference>>> this.client.manga.getCharacters(this.id)
  }

  public getNews (offset?: number, maxCount?: number) {
    return <Promise<Array<MangaNews>>> this.client.manga.getNews(this.id, offset, maxCount)
  }

  public getTopics () {
    return <Promise<Array<MangaTopic>>> this.client.manga.getTopics(this.id)
  }

  public getPictures () {
    return <Promise<Array<Image>>> this.client.manga.getPictures(this.id)
  }

  public getStatistics () {
    return <Promise<MangaStatistics>> this.client.manga.getStatistics(this.id)
  }

  public getMoreInfo () {
    return <Promise<string | null>> this.client.manga.getMoreInfo(this.id)
  }

  public getUserUpdates () {
    return <Promise<Array<MangaUserUpdate>>> this.client.manga.getUserUpdates(this.id)
  }

  public getReviews () {
    return <Promise<Array<MangaReview>>> this.client.manga.getReviews(this.id)
  }

  public getRelations () {
    return <Promise<Array<MangaRelationGroup<ContentRelationType>>>> this.client.manga.getRelations(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.type = Manga.parseType(data.type)
    this.chapters = Manga.parseNumber(data.chapters)
    this.volumes = Manga.parseNumber(data.volumes)
    this.publishInfo = new MangaPublishInformation(client, data)
    this.authors = data.authors.map((author: any) => new PersonMeta(this.client, author))
    this.serializations = data.serializations.map((serialization: any) => new MagazineMeta(this.client, serialization))
    this.genres = data.genres.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Genre'))
    this.explicitGenres = data.explicit_genres.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Explicit'))
    this.demographics = data.demographics.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Demographic'))
    this.themes = data.themes.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Theme'))
  }
}

export class MangaCharacterReference extends BaseClass {
  public readonly mangaId: number
  public readonly character: CharacterMeta
  public readonly role: string

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, data: any) {
    super(client)

    this.mangaId = mangaId
    this.character = new CharacterMeta(client, data.character)
    this.role = MangaCharacterReference.parseString(data.role)
  }
}

export class MangaNews extends ContentNews {
  public readonly mangaId: number

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, data: any) {
    super(client, data)

    this.mangaId = mangaId
  }
}

export class MangaTopic extends BaseResource {
  public readonly mangaId: number
  public readonly title: string
  public readonly date: Date
  public readonly authorUsername: string
  public readonly authorURL: URL
  public readonly comments: number

  public constructor (client: Client, mangaId: number, data: any) {
    super(client, data)

    this.mangaId = mangaId
    this.title = MangaTopic.parseString(data.title)
    this.date = MangaTopic.parseDate(data.date)
    this.authorUsername = MangaTopic.parseString(data.author_username)
    this.authorURL = MangaTopic.parseURL(data.author_url)
    this.comments = MangaTopic.parseNumber(data.comments)
  }
}

export class MangaStatistics extends ContentStatistics {
  public readonly mangaId: number
  public readonly reading: number
  public readonly planToRead: number

  public constructor (client: Client, mangaId: number, data: any) {
    super(client, data)

    this.mangaId = mangaId
    this.reading = MangaStatistics.parseNumber(data.reading)
    this.planToRead = MangaStatistics.parseNumber(data.plan_to_read)
  }
}

export class MangaRecommendation extends BaseClass {
  public readonly mangaId: number
  public readonly entry: MangaMeta
  public readonly URL: URL
  public readonly votes: number

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, data: any) {
    super(client)

    this.mangaId = mangaId
    this.entry = new MangaMeta(client, data.entry)
    this.URL = MangaRecommendation.parseURL(data.url)
    this.votes = MangaRecommendation.parseNumber(data.votes)
  }
}

export class MangaUserUpdate extends ContentUserUpdate {
  public readonly mangaId: number
  public readonly volumesRead: number
  public readonly volumesTotal: number
  public readonly chaptersRead: number
  public readonly chaptersTotal: number

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, data: any) {
    super(client, data)

    this.mangaId = mangaId
    this.volumesRead = MangaUserUpdate.parseNumber(data.volumes_read)
    this.volumesTotal = MangaUserUpdate.parseNumber(data.volumes_total)
    this.chaptersRead = MangaUserUpdate.parseNumber(data.chapters_read)
    this.chaptersTotal = MangaUserUpdate.parseNumber(data.chapters_total)
  }
}

export class MangaReviewScores extends ContentReviewScores {
  public readonly art: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.art = data.art
  }
}

export class MangaReview extends ContentReview {
  public readonly mangaId: number
  public readonly chaptersRead: number
  public readonly scores: MangaReviewScores

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, data: any) {
    super(client, data)

    this.mangaId = mangaId
    this.chaptersRead = MangaReview.parseNumber(data.chapters_read)
    this.scores = new MangaReviewScores(client, data.scores)
  }
}

export class MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
  public readonly mangaId: number
  public readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>

  public getManga () {
    return <Promise<Manga>> this.client.manga.get(this.mangaId)
  }

  public constructor (client: Client, mangaId: number, relation: T, data: any) {
    super(client, relation, data)

    this.mangaId = mangaId
    this.items = data.map((item: any) => new (this.relation === 'Adaptation' ? AnimeMeta : MangaMeta)(this.client, item))
  }
}
