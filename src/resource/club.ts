import { Client } from '../core/client'
import { BaseClass, BaseResource } from './base'
import { URL } from 'url'

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

export type ClubType =
  | 'Public'
  | 'Private'
  | 'Secret'

export class Club extends BaseResource {
  // eslint-disable-next-line tsdoc/syntax
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

      default:
        throw new Error(`Unknown club category: ${input}`)
    }
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseType (input: any): ClubType {
    switch (input?.toLowerCase().trim()) {
      case 'public': return 'Public'
      case 'private': return 'Private'
      case 'secret': return 'Secret'

      default:
        throw new Error(`Unknown club type: ${input}`)
    }
  }

  public readonly imageURL: URL | null
  public readonly memberCount: number
  public readonly pictureCount: number
  public readonly category: ClubCategory
  public readonly created: Date
  public readonly type: ClubType
  public readonly staff: Array<ClubStaff>

  public getMembers () {
    return <Promise<Array<ClubMember>>> this.client.clubs.getMembers(this.ID)
  }

  public constructor (client: Client, data: any) {
    super(client, data)

    this.imageURL = Club.parseURL(data.images?.jpg?.image_url, true)
    this.memberCount = Club.parseNumber(data.members_count)
    this.pictureCount = Club.parseNumber(data.pictures_count)
    this.category = Club.parseCategory(data.category)
    this.created = Club.parseDate(data.created)
    this.type = Club.parseType(data.type)
    this.staff = data.staff.map((staff: any) => new ClubStaff(client, this.ID, staff))
  }
}

export class ClubStaff extends BaseClass {
  public readonly clubID: number
  public readonly URL: URL
  public readonly username: string

  public getClub () {
    return <Promise<Club>> this.client.clubs.get(this.clubID)
  }

  public constructor (client: Client, clubID: number, data: any) {
    super(client)

    this.clubID = clubID
    this.URL = ClubStaff.parseURL(data.url)
    this.username = ClubStaff.parseString(data.username)
  }
}

export class ClubMember extends BaseClass {
  public readonly clubID: number
  public readonly URL: URL
  public readonly username: string
  public readonly imageURL: URL | null

  public getClub () {
    return <Promise<Club>> this.client.clubs.get(this.clubID)
  }

  public constructor (client: Client, clubID: number, data: any) {
    super(client)

    this.clubID = clubID
    this.URL = ClubMember.parseURL(data.url)
    this.username = ClubMember.parseString(data.username)
    this.imageURL = ClubMember.parseURL(data.image_url, true)
  }
}
