import { Client } from '../../core/client'
import { BaseClass, BaseResource } from '../base'
import { Image } from '../misc'
import { URL } from 'url'

export class ContentImage extends BaseClass {
  public readonly jpg: Image
  public readonly webp: Image

  public constructor (client: Client, data: any) {
    super(client)

    this.jpg = new Image(client, data?.jpg)
    this.webp = new Image(client, data?.webp)
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

export class ContentStatisticsScore extends BaseClass {
  public readonly score: number
  public readonly votes: number
  public readonly percentage: number

  public constructor (client: Client, data: any) {
    super(client)

    this.score = data.score
    this.votes = data.votes
    this.percentage = data.percentage
  }
}

export class ContentStatistics extends BaseClass {
  public readonly completed: number
  public readonly onHold: number
  public readonly dropped: number
  public readonly total: number
  public readonly scores: ContentStatisticsScore

  public constructor (client: Client, data: any) {
    super(client)

    this.completed = data.completed
    this.onHold = data.on_hold
    this.dropped = data.dropped
    this.total = data.total
    this.scores = data.scores?.map((score: any) => new ContentStatisticsScore(client, score)) || []
  }
}

export class ContentNews extends BaseResource {
  public readonly title: string
  public readonly date: Date
  public readonly authorUsername: string
  public readonly authorURL: URL
  public readonly forumURL: URL
  public readonly imageURL: URL | null
  public readonly comments: number
  public readonly excerpt: string

  public constructor (client: Client, data: any) {
    super(client, data)

    this.title = data.title
    this.date = new Date(data.date)
    this.authorUsername = data.author_username
    this.authorURL = ContentNews.parseURL(data.author_url)
    this.forumURL = ContentNews.parseURL(data.forum_url)
    this.imageURL = ContentNews.parseURL(data.images?.jpg?.image_url, true)
    this.comments = data.comments
    this.excerpt = data.excerpt
  }
}

export class ContentUser extends BaseClass {
  public readonly username: string
  public readonly url: URL
  public readonly imageUrl: URL | null

  public constructor (client: Client, data: any) {
    super(client)

    this.username = data.username
    this.url = ContentUser.parseURL(data.url)
    this.imageUrl = ContentUser.parseURL(data.images?.jpg?.image_url, true)
  }
}

export class ContentReviewScores extends BaseClass {
  public readonly overall: number
  public readonly story: number
  public readonly character: number
  public readonly enjoyment: number

  public constructor (client: Client, data: any) {
    super(client)

    this.overall = data.overall
    this.story = data.story
    this.character = data.character
    this.enjoyment = data.enjoyment
  }
}

export class ContentReview extends BaseResource {
  public readonly type: string
  public readonly votes: number
  public readonly date: Date
  public readonly review: string
  public readonly scores: ContentReviewScores
  public readonly user: ContentUser

  public constructor (client: Client, data: any) {
    super(client, data)

    this.type = data.type
    this.votes = data.votes
    this.date = new Date(data.date)
    this.review = data.review
    this.scores = new ContentReviewScores(client, data.scores)
    this.user = new ContentUser(client, data.user)
  }
}

export class ContentUserUpdate extends BaseClass {
  public readonly user: ContentUser
  public readonly score: number
  public readonly status: string
  public readonly date: Date

  public constructor (client: Client, data: any) {
    super(client)

    this.user = new ContentUser(client, data.user)
    this.score = data.score
    this.status = data.status
    this.date = new Date(data.date)
  }
}

export type ContentRelationType =
  'Adaptation' | 'SideStory' | 'Summary' | 'Sequel' | 'Prequel' | 'Character' | 'Other' |
  'AlternativeVersion' | 'AlternativeSetting' | 'SpinOff' | 'ParentStory' | 'FullStory' | 'Unknown'

export class ContentRelationGroup <T extends ContentRelationType> extends BaseClass {
  /** @hidden */
  public static parseRelation (data: any): ContentRelationType {
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

  public readonly relation: T

  public constructor (client: Client, relation: T, data: any) {
    super(client)

    this.relation = relation
  }
}

export class ContentExternal extends BaseClass {
  public readonly name: string
  public readonly url: URL

  public constructor (client: Client, data: any) {
    super(client)

    this.name = data.name
    this.url = data.url && new URL(data.url)
  }
}
