import { Client } from '../core/client'
import { BaseClass, BaseResource } from './base'

export type ClubCategory =
  | 'ActorsAndArtists'
  | 'Anime'
  | 'Characters'
  | 'CitiesAndNeighborhoods'
  | 'Companies'
  | 'Conventions'
  | 'Games'
  | 'Japan'
  | 'Manga'
  | 'Music'
  | 'Others'
  | 'Schools'
  | 'None'
  | 'Unknown'

export type ClubType =
  | 'Public'
  | 'Private'
  | 'Secret'
  | 'Unknown'

export class Club extends BaseResource {
  /** @hidden */
  public static parseCategory (input: any): ClubCategory {
    switch (input?.toLowerCase().trim()) {
      case 'actors & artists': return 'ActorsAndArtists'
      case 'anime': return 'Anime'
      case 'characters': return 'Characters'
      case 'cities & neighborhoods': return 'CitiesAndNeighborhoods'
      case 'companies': return 'Companies'
      case 'conventions': return 'Conventions'
      case 'games': return 'Games'
      case 'japan': return 'Japan'
      case 'manga': return 'Manga'
      case 'music': return 'Music'
      case 'other':
      case 'others': return 'Others'
      case 'schools': return 'Schools'
      case 'none': return 'None'

      default: return 'Unknown'
    }
  }

  /** @hidden */
  public static parseType (input: any): ClubType {
    switch (input?.toLowerCase().trim()) {
      case 'public': return 'Public'
      case 'private': return 'Private'
      case 'secret': return 'Secret'

      default: return 'Unknown'
    }
  }

  public readonly imageUrl: URL | null
  public readonly memberCount: number
  public readonly pictureCount: number
  public readonly category: ClubCategory
  public readonly created: Date
  public readonly type: ClubType
  public readonly staff: Array<ClubStaff>

  public getMembers () {
    return <Promise<Array<ClubMember>>> this.client.clubs.getMembers(this.id)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.imageUrl = Club.parseURL(data.images?.jpg?.image_url, true)
    this.memberCount = data.members_count
    this.pictureCount = data.pictures_count
    this.category = Club.parseCategory(data.category)
    this.created = Club.parseDate(data.created)
    this.type = Club.parseType(data.type)
    this.staff = data.staff?.map((staff: any) => new ClubStaff(client, staff)) || []
  }
}

export class ClubStaff extends BaseClass {
  public readonly url: URL
  public readonly username: string

  public constructor (client: Client, data: any) {
    super(client)

    this.url = ClubStaff.parseURL(data.url)
    this.username = data.username
  }
}

export class ClubMember extends BaseClass {
  public readonly URL: URL
  public readonly username: string
  public readonly imageURL: URL | null

  public constructor (client: Client, data: any) {
    super(client)

    this.URL = ClubMember.parseURL(data.url)
    this.username = data.username
    this.imageURL = ClubMember.parseURL(data.image_url, true)
  }
}
