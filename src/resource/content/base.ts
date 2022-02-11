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
  public readonly synonyms: Array<string>

  public toString () {
    return this.default
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.default = ContentTitle.parseString(data.title)
    this.english = ContentTitle.parseString(data.english, true)
    this.japanese = ContentTitle.parseString(data.japanese, true)
    this.synonyms = data.synonyms?.map((synonym: any) => ContentTitle.parseString(synonym, true)).filter((synonym: any) => !!synonym) || []
  }
}

export class Content extends BaseResource {
  public readonly image: ContentImage
  public readonly title: ContentTitle
  public readonly score: number | null
  public readonly scoredBy: number | null
  public readonly rank: number
  public readonly popularity: number
  public readonly members: number
  public readonly favorites: number
  public readonly synopsis: string | null
  public readonly background: string | null

  public constructor (client: Client, data: any) {
    super(client, data)

    this.image = new ContentImage(client, data.images)
    this.title = new ContentTitle(client, data)
    this.score = Content.parseNumber(data.score || data.scored, true)
    this.scoredBy = Content.parseNumber(data.scored_by, true)
    this.rank = Content.parseNumber(data.rank)
    this.popularity = Content.parseNumber(data.popularity)
    this.members = Content.parseNumber(data.members)
    this.favorites = Content.parseNumber(data.favorites)
    this.synopsis = Content.parseString(data.synopsis, true)
    this.background = Content.parseString(data.background, true)
  }
}

export class ContentStatisticsScore extends BaseClass {
  public readonly score: number
  public readonly votes: number
  public readonly percentage: number

  public constructor (client: Client, data: any) {
    super(client)

    this.score = ContentStatisticsScore.parseNumber(data.score)
    this.votes = ContentStatisticsScore.parseNumber(data.votes)
    this.percentage = ContentStatisticsScore.parseNumber(data.percentage)
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

    this.completed = ContentStatistics.parseNumber(data.completed)
    this.onHold = ContentStatistics.parseNumber(data.on_hold)
    this.dropped = ContentStatistics.parseNumber(data.dropped)
    this.total = ContentStatistics.parseNumber(data.total)
    this.scores = data.scores.map((score: any) => new ContentStatisticsScore(client, score))
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

    this.title = ContentNews.parseString(data.title)
    this.date = new Date(data.date)
    this.authorUsername = ContentNews.parseString(data.author_username)
    this.authorURL = ContentNews.parseURL(data.author_url)
    this.forumURL = ContentNews.parseURL(data.forum_url)
    this.imageURL = ContentNews.parseURL(data.images?.jpg?.image_url, true)
    this.comments = ContentNews.parseNumber(data.comments)
    this.excerpt = ContentNews.parseString(data.excerpt)
  }
}

export class ContentUser extends BaseClass {
  public readonly username: string
  public readonly URL: URL
  public readonly imageURL: URL | null

  public constructor (client: Client, data: any) {
    super(client)

    this.username = ContentUser.parseString(data.username)
    this.URL = ContentUser.parseURL(data.url)
    this.imageURL = ContentUser.parseURL(data.images?.jpg?.image_url, true)
  }
}

export class ContentReviewScores extends BaseClass {
  public readonly overall: number
  public readonly story: number
  public readonly character: number
  public readonly enjoyment: number

  public constructor (client: Client, data: any) {
    super(client)

    this.overall = ContentReviewScores.parseNumber(data.overall)
    this.story = ContentReviewScores.parseNumber(data.story)
    this.character = ContentReviewScores.parseNumber(data.character)
    this.enjoyment = ContentReviewScores.parseNumber(data.enjoyment)
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

    this.type = ContentReview.parseString(data.type)
    this.votes = ContentReview.parseNumber(data.votes)
    this.date = new Date(data.date)
    this.review = ContentReview.parseString(data.review)
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
    this.score = ContentUserUpdate.parseNumber(data.score)
    this.status = ContentUserUpdate.parseString(data.status)
    this.date = new Date(data.date)
  }
}

export type ContentRelationType =
  'Adaptation' | 'SideStory' | 'Summary' | 'Sequel' | 'Prequel' | 'Character' | 'Other' |
  'AlternativeVersion' | 'AlternativeSetting' | 'SpinOff' | 'ParentStory' | 'FullStory'

export class ContentRelationGroup <T extends ContentRelationType> extends BaseClass {
  // eslint-disable-next-line tsdoc/syntax
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

      default:
        throw new Error(`Unknown relation: ${data}`)
    }
  }

  public readonly relation: T

  public constructor (client: Client, relation: T, data: any) {
    super(client)

    this.relation = relation
  }
}
