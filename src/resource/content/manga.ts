import { Client } from '../../core/client'
import {
  Content,
  ContentRelationType,
  ContentRelationGroup,
  ContentNews,
  ContentStatistics,
  ContentUserUpdate,
  ContentReactions,
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
import { Image } from '../misc'
import { mangaExplicitGenres } from '../../manager/genre'

export type MangaType = 'Manga' | 'Novel' | 'LightNovel' | 'OneShot' | 'Doujinshi' | 'Manhua' | 'Manhwa' | 'OEL' | 'Unknown'
export type MangaPublishStatus = 'Finished' | 'Publishing' | 'OnHiatus' | 'Discontinued' | 'NotYetPublished' | 'Unknown'

export interface MangaPublishInformation {
  readonly status: MangaPublishStatus
  readonly publishing: boolean
  readonly publishedFrom: Date | null
  readonly publishedTo: Date | null
}

export class Manga extends Content {
  /** @hidden */
  public static parsePublishStatus (input: any): MangaPublishStatus {
    switch (input?.toLowerCase().trim()) {
      case 'finished': return 'Finished'
      case 'publishing': return 'Publishing'
      case 'on hiatus': return 'OnHiatus'
      case 'discontinued': return 'Discontinued'
      case 'not yet published': return 'NotYetPublished'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parsePublishInfo (data: any): MangaPublishInformation {
    return {
      status: this.parsePublishStatus(data.status),
      publishing: !!data.publishing,
      publishedFrom: Manga.parseDate(data.published.from, true),
      publishedTo: Manga.parseDate(data.published.to, true)
    }
  }

  /** @hidden */
  public static parseType (input: any): MangaType {
    switch (input?.toLowerCase().trim()) {
      case 'manga': return 'Manga'
      case 'novel': return 'Novel'
      case 'light novel': return 'LightNovel'
      case 'one-shot': return 'OneShot'
      case 'doujinshi':
      case 'doujin': return 'Doujinshi'
      case 'manhua': return 'Manhua'
      case 'manhwa': return 'Manhwa'
      case 'oel': return 'OEL'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseStatistics (data: any): MangaStatistics {
    return {
      ...super.parseStatistics(data),

      reading: data.reading,
      planToRead: data.plan_to_read
    }
  }

  /** @hidden */
  public static parseUserUpdate (data: any): MangaUserUpdate {
    return {
      ...super.parseUserUpdate(data),
      volumesRead: data.volumes_read,
      volumesTotal: data.volumes_total,
      chaptersRead: data.chapters_read,
      chaptersTotal: data.chapters_total
    }
  }

  /** @hidden */
  public static parseReview (data: any): MangaReview {
    return {
      ...super.parseReview(data),

      chaptersRead: data.chapters_read,
      reactions: this.parseReactions(data.reactions)
    }
  }

  /** @hidden */
  public static parseTopReview (client: Client, data: any): TopMangaReview {
    return {
      ...this.parseReview(data),
      manga: new MangaMeta(client, data.entry)
    }
  }

  /** @hidden */
  public static parseRelationGroup<T extends ContentRelationType> (client: Client, relation: T, data: any): MangaRelationGroup<T> {
    const a = super.parseRelationGroup(client, relation, data)

    return {
      ...a,
      items: data.entry?.map((item: any) => new (a.relation === 'Adaptation' ? AnimeMeta : MangaMeta)(client, item)) || []
    }
  }

  /** @hidden */
  public static parseCharacerReference (client: Client, data: any): MangaCharacterReference {
    return {
      character: new CharacterMeta(client, data.character),
      role: data.role
    }
  }

  /** @hidden */
  public static parseTopic (data: any): MangaTopic {
    return {
      id: data.mal_id,
      url: this.parseURL(data.url, false),
      title: data.title,
      date: this.parseDate(data.date),
      authorUsername: data.author_username,
      authorURL: data.author_url,
      comments: data.comments
    }
  }

  /** @hidden */
  public static parseRecommendation (client: Client, data: any): MangaRecommendation {
    return {
      entry: new MangaMeta(client, data.entry),
      URL: this.parseURL(data.url),
      votes: data.votes
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
    this.publishInfo = Manga.parsePublishInfo(data)
    this.authors = data.authors?.map((author: any) => new PersonMeta(this.client, author)) || []
    this.serializations = data.serializations?.map((serialization: any) => new MagazineMeta(this.client, serialization)) || []
    this.genres = data.genres?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Genre')) || []
    this.explicitGenres = data.explicit_genres?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Explicit')) || []
    this.demographics = data.demographics?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Demographic')) || []
    this.themes = data.themes?.map((genre: any) => new MangaGenreMeta(this.client, genre, 'Theme')) || []
  }
}

export interface MangaCharacterReference {
  readonly character: CharacterMeta
  readonly role: string
}

export interface MangaTopic {
  readonly id: number
  readonly url: string
  readonly title: string
  readonly date: Date
  readonly authorUsername: string
  readonly authorURL: string
  readonly comments: number
}

export interface MangaStatistics extends ContentStatistics {
  readonly reading: number
  readonly planToRead: number
}

export interface MangaRecommendation {
  readonly entry: MangaMeta
  readonly URL: string
  readonly votes: number
}

export interface MangaUserUpdate extends ContentUserUpdate {
  readonly volumesRead: number
  readonly volumesTotal: number
  readonly chaptersRead: number
  readonly chaptersTotal: number
}

export interface MangaReview extends ContentReview {
  readonly chaptersRead: number
  readonly reactions: ContentReactions
}

export interface TopMangaReview extends MangaReview {
  readonly manga: MangaMeta
}

export interface MangaRelationGroup<T extends ContentRelationType> extends ContentRelationGroup<T> {
  readonly items: T extends 'Adaptation' ? Array<AnimeMeta> : Array<MangaMeta>
}

export class MangaFull extends Manga {
  public readonly relations: Array<MangaRelationGroup<ContentRelationType>>
  public readonly external: Array<ContentExternal>

  public constructor (client: Client, data: any) {
    super(client, data)

    this.relations = data.relations?.map((relation: any) => Manga.parseRelationGroup(client, Manga.parseRelationType(relation.relation), relation)) || []
    this.external = data.external?.map((external: any) => Manga.parseExternal(external)) || []
  }
}
