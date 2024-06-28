import { Client } from '../../core/client'
import { BaseClass, BaseResource } from '../base'
import {
  Content,
  ContentRelationType,
  ContentRelationGroup,
  ContentNews,
  ContentStatistics,
  ContentUserUpdate,
  ContentReview,
  ContentExternal
} from './base'
import {
  PersonMeta,
  MagazineMeta,
  MangaGenreMeta,
  CharacterMeta,
  MangaMeta,
  AnimeMeta
} from '../meta'
import { ImageFormatCollection } from '../misc'
import { mangaExplicitGenres } from '../../manager/genre'

export type MangaType = 'Manga' | 'Novel' | 'Light Novel' | 'One Shot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown'
export type MangaPublishStatus = 'Finished' | 'Publishing' | 'On Hiatus' | 'Discontinued' | 'Not Yet Published' | 'Unknown'

export class MangaPublishInformation extends BaseClass {
  /** @hidden */
  public static parseMangaPublishStatus (input: any): MangaPublishStatus {
    switch (input?.toLowerCase().trim()) {
      case 'finished': return 'Finished'
      case 'publishing': return 'Publishing'
      case 'on hiatus': return 'On Hiatus'
      case 'discontinued': return 'Discontinued'
      case 'not yet published': return 'Not Yet Published'

      default: return 'Unknown'
    }
  }

  public readonly status: MangaPublishStatus
  public readonly publishing: boolean
  public readonly publishedFrom: Date | null
  public readonly publishedTo: Date | null

  public constructor (client: Client, data: any) {
    super(client)

    this.status = MangaPublishInformation.parseMangaPublishStatus(data.status)
    this.publishing = !!data.publishing
    this.publishedFrom = MangaPublishInformation.parseDate(data.published.from, true)
    this.publishedTo = MangaPublishInformation.parseDate(data.published.to, true)
  }
}

export class Manga extends Content {
  /** @hidden */
  public static parseType (input: any): MangaType {
    switch (input?.toLowerCase().trim()) {
      case 'manga': return 'Manga'
      case 'novel': return 'Novel'
      case 'light novel': return 'Light Novel'
      case 'one-shot': return 'One Shot'
      case 'doujinshi':
      case 'doujin': return 'Doujinshi'
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
    return <Promise<Array<ContentNews>>> this.client.manga.getNews(this.id, offset, maxCount)
  }

  public getTopics () {
    return <Promise<Array<MangaTopic>>> this.client.manga.getTopics(this.id)
  }

  public getPictures () {
    return <Promise<Array<ImageFormatCollection>>> this.client.manga.getPictures(this.id)
  }

  public getStatistics () {
    return <Promise<MangaStatistics>> this.client.manga.getStatistics(this.id)
  }

  public getMoreInfo () {
    return <Promise<string | null>> this.client.manga.getMoreInfo(this.id)
  }

  public getRecommendations() {
    return <Promise<Array<MangaRecommendation>>>this.client.manga.getRecommendations(this.id)
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

  public getExternal () {
    return <Promise<Array<ContentExternal>>> this.client.manga.getExternal(this.id)
  }

  public getFull () {
    return <Promise<MangaFull>> this.client.manga.getFull(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.type = Manga.parseType(data.type)
    this.chapters = data.chapters
    this.volumes = data.volumes
    this.publishInfo = new MangaPublishInformation(client, data)
    this.authors = data.authors?.map((author: any) => new PersonMeta(this.client, author)) || []
    this.serializations = data.serializations?.map((serialization: any) => new MagazineMeta(this.client, serialization)) || []
    this.genres = data.genres?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Genre')) || []
    this.explicitGenres = data.explicit_genres?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Explicit')) || []
    this.demographics = data.demographics?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Demographic')) || []
    this.themes = data.themes?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Theme')) || []
  }
}

export class MangaCharacterReference extends BaseClass {
  public readonly character: CharacterMeta
  public readonly role: string

  public constructor (client: Client, data: any) {
    super(client)

    this.character = new CharacterMeta(client, data.character)
    this.role = data.role
  }
}

export class MangaTopic extends BaseResource {
  public readonly title: string
  public readonly date: Date
  public readonly authorUsername: string
  public readonly authorURL: URL
  public readonly comments: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.title = data.title
    this.date = MangaTopic.parseDate(data.date)
    this.authorUsername = data.author_username
    this.authorURL = MangaTopic.parseURL(data.author_url)
    this.comments = data.comments
  }
}

export class MangaStatistics extends ContentStatistics {
  public readonly reading: number
  public readonly planToRead: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.reading = data.reading
    this.planToRead = data.plan_to_read
  }
}

export class MangaRecommendation extends BaseClass {
  public readonly entry: MangaMeta
  public readonly URL: URL
  public readonly votes: number

  public constructor (client: Client, data: any) {
    super(client)

    this.entry = new MangaMeta(client, data.entry)
    this.URL = MangaRecommendation.parseURL(data.url)
    this.votes = data.votes
  }
}

export class MangaUserUpdate extends ContentUserUpdate {
  public readonly volumesRead: number
  public readonly volumesTotal: number
  public readonly chaptersRead: number
  public readonly chaptersTotal: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.volumesRead = data.volumes_read
    this.volumesTotal = data.volumes_total
    this.chaptersRead = data.chapters_read
    this.chaptersTotal = data.chapters_total
  }
}

export class MangaReview extends ContentReview {
  public readonly chaptersRead: number

  public constructor (client: Client, data: any) {
    super(client, data)

    this.chaptersRead = data.chapters_read || 0
  }
}

export class MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
  public readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>

  public constructor (client: Client, relation: T, data: any) {
    super(client, relation)

    this.items = data.entry?.map((item: any) => new (this.relation === 'Adaptation' ? AnimeMeta : MangaMeta)(this.client, item)) || []
  }
}

export class MangaFull extends Manga {
  public readonly relations: Array<MangaRelationGroup<ContentRelationType>>
  public readonly external: Array<ContentExternal>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.relations = data.relations?.map((relation: any) => new MangaRelationGroup(client, MangaRelationGroup.parseRelation(relation.relation), relation)) || []
    this.external = data.external?.map((external: any) => new ContentExternal(client, external)) || []
  }
}
