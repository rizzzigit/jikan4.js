import { Client } from '../../core/client'
import { BaseClass, BaseResource } from '../base'
import { Image } from '../misc'

export class ContentImage extends BaseClass {
  public readonly jpg: Image
  public readonly webp: Image

  public constructor (client: Client, data: any) {
    super(client)

    this.jpg = ContentImage.parseImage(data?.jpg)
    this.webp = ContentImage.parseImage(data?.webp)
  }
}

export class ContentTitle extends BaseClass {
  public readonly default: string
  public readonly english: string | null
  public readonly japanese: string | null
  public readonly german: string | null
  public readonly spanish: string | null
  public readonly french: string | null
  public readonly synonyms: Array<string>

  public toString () {
    return this.default
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.synonyms = []
    this.english = null
    this.japanese = null
    this.german = null
    this.spanish = null
    this.french = null
    this.default = '(no title)'
    for (const { type, title } of data) {
      const titleTrimmed = title.trim()
      if (!titleTrimmed) {
        continue
      }

      switch (type) {
        case 'Default':
          this.default = titleTrimmed
          break

        case 'Japanese':
          this.japanese = titleTrimmed
          break

        case 'English':
          this.english = titleTrimmed
          break

        case 'German':
          this.german = titleTrimmed
          break

        case 'Spanish':
          this.spanish = titleTrimmed
          break

        case 'French':
          this.french = titleTrimmed
          break

        case 'Synonym':
          this.synonyms.push(titleTrimmed)
          break
      }
    }
  }
}

export type TitleArray = Array<{
  type: string
  title: string
}>

export class Content extends BaseResource {
  public static parseStatisticsScore (data: any): ContentStatisticsScore {
    return {
      score: data.score,
      votes: data.votes,
      percentage: data.percentage
    }
  }

  /** @hidden */
  public static parseStatistics (data: any): ContentStatistics {
    return {
      completed: data.completed,
      onHold: data.on_hold,
      dropped: data.dropped,
      total: data.total,
      scores: data.scores?.map((score: any) => this.parseStatisticsScore(score))
    }
  }

  /** @hidden */
  public static parseUserUpdate (data: any): ContentUserUpdate {
    return {
      user: this.parseUser(data.user),
      score: data.score,
      status: data.status,
      date: new Date(data.date)
    }
  }

  /** @hidden */
  public static parseUser (data: any): ContentUser {
    return {
      username: data.username,
      url: data.url,
      imageUrl: Content.parseURL(data.images?.jpg?.image_url, true)
    }
  }

  /** @hidden */
  public static parseReview (data: any): ContentReview {
    return {
      id: data.mal_id,
      url: Content.parseURL(data.url),
      type: data.type,
      votes: data.votes,
      date: new Date(data.date),
      review: data.review,
      reactions: this.parseReactions(data.reactions),
      user: this.parseUser(data.user),
      isSpoiler: data.is_spoiler,
      isPreliminary: data.is_preliminary,
      tags: data.tags
    }
  }

  /** @hidden */
  public static parseNews (data: any): ContentNews {
    return {
      id: data.mal_id,
      url: data.url,
      title: data.title,
      date: new Date(data.date),
      authorUsername: data.author_username,
      authorURL: this.parseURL(data.author_url),
      forumURL: this.parseURL(data.forum_url),
      imageURL: this.parseURL(data.data.images?.jpg?.image_url, true),
      comments: data.comments,
      excerpt: data.excerpt
    }
  }

  /** @hidden */
  public static parseReactions (data: any): ContentReactions {
    return {
      overall: data.overall,
      nice: data.nice,
      loveIt: data.love_it,
      funny: data.funny,
      confusing: data.confusing,
      informative: data.informative,
      wellWritten: data.well_written,
      creative: data.creative
    }
  }

  /** @hidden */
  public static parseRelationType (data: any): ContentRelationType {
    switch (data?.toLowerCase().trim() || 'any') {
      case 'adaptation': return 'Adaptation'
      case 'side story': return 'SideStory'
      case 'summary': return 'Summary'
      case 'sequel': return 'Sequel'
      case 'prequel': return 'Prequel'
      case 'character': return 'Character'
      case 'other': return 'Other'
      case 'alternative setting': return 'AlternativeSetting'
      case 'alternative version': return 'AlternativeVersion'
      case 'spin-off': return 'SpinOff'
      case 'full story': return 'FullStory'
      case 'parent story': return 'ParentStory'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseRelationGroup <T extends ContentRelationType> (client: Client, relation: T, data: any): ContentRelationGroup<T> {
    return { relation }
  }

  /** @hidden */
  public static parseExternal (data: any): ContentExternal {
    return {
      name: data.name,
      url: this.parseURL(data.url, true)
    }
  }

  public readonly image: ContentImage
  public readonly title: ContentTitle
  public readonly titles: TitleArray
  public readonly score: number | null
  public readonly scoredBy: number | null
  public readonly rank: number
  public readonly popularity: number
  public readonly members: number
  public readonly favorites: number
  public readonly synopsis: string | null
  public readonly background: string | null
  public readonly approved: boolean

  public constructor (client: Client, data: any) {
    super(client, data)

    this.image = new ContentImage(client, data.images)
    this.title = new ContentTitle(client, data.titles)
    this.titles = data.titles
    this.score = data.score || data.scored || null
    this.scoredBy = data.scored_by || null
    this.rank = data.rank
    this.popularity = data.popularity
    this.members = data.members
    this.favorites = data.favorites
    this.synopsis = data.synopsis || null
    this.background = data.background || null
    this.approved = data.approved
  }
}

export interface ContentStatisticsScore {
  readonly score: number
  readonly votes: number
  readonly percentage: number
}

export interface ContentStatistics {
  readonly completed: number
  readonly onHold: number
  readonly dropped: number
  readonly total: number
  readonly scores: ContentStatisticsScore
}

export interface ContentNews {
  readonly id: number
  readonly url: string
  readonly title: string
  readonly date: Date
  readonly authorUsername: string
  readonly authorURL: string
  readonly forumURL: string
  readonly imageURL: string | null
  readonly comments: number
  readonly excerpt: string
}

export interface ContentUser {
  readonly username: string
  readonly url: string
  readonly imageUrl: string | null
}

export interface ContentReactions {
  readonly overall: number
  readonly nice: number
  readonly loveIt: number
  readonly funny: number
  readonly confusing: number
  readonly informative: number
  readonly wellWritten: number
  readonly creative: number
}

export interface ContentReview {
  readonly id: number
  readonly url: string
  readonly type: string
  readonly votes: number
  readonly date: Date
  readonly review: string
  readonly reactions: ContentReactions
  readonly user: ContentUser
  readonly isSpoiler: boolean
  readonly isPreliminary: boolean
  readonly tags: Array<string>
}

export interface ContentUserUpdate {
  readonly user: ContentUser
  readonly score: number
  readonly status: string
  readonly date: Date
}

export type ContentRelationType =
  'Adaptation' | 'SideStory' | 'Summary' | 'Sequel' | 'Prequel' | 'Character' | 'Other' |
  'AlternativeVersion' | 'AlternativeSetting' | 'SpinOff' | 'ParentStory' | 'FullStory' | 'Unknown'

export interface ContentRelationGroup <T extends ContentRelationType> {
  readonly relation: T
}

export interface ContentExternal {
  readonly name: string
  readonly url: string | null
}
