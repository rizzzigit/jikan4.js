import { BaseManager } from '../manager/base'
import { Club, ClubMember, ClubRelations, ClubStaff } from '../resource/club'
import { translateObject } from '../utils'

export interface ClubSearchFilter {
  type: 'public' | 'private' | 'secret'
  category:
    | 'anime'
    | 'manga'
    | 'actors_and_artists'
    | 'characters'
    | 'cities_and_neighborhoods'
    | 'companies'
    | 'conventions'
    | 'games'
    | 'japan'
    | 'music'
    | 'other'
    | 'schools'
  orderBy:
    | 'mal_id'
    | 'title'
    | 'members_count'
    | 'pictures_count'
    | 'created'
  sort: 'desc' | 'asc'
}

export class ClubManager extends BaseManager {
  public async search (searchString: string, filter?: Partial<ClubSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('clubs', offset, maxCount, {
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'orderBy': return ['order_by', value]

          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((club) => new Club(this.client, club))
  }

  public async get (clubId: number): Promise<Club | null | undefined> {
    const rawData = await this.request(`clubs/${clubId}`)

    if (rawData) {
      return new Club(this.client, rawData)
    } else {
      return rawData === null ? null : undefined
    }
  }

  public async getMembers (clubId: number): Promise<Array<ClubMember> | undefined> {
    const rawData = await this.requestPaginated(`clubs/${clubId}/members`)

    return rawData ? rawData.map((member: any) => new ClubMember(this.client, member)) : undefined
  }

  public async getStaff (clubId: number): Promise<Array<ClubStaff> | undefined> {
    const rawData = await this.requestPaginated(`clubs/${clubId}/staff`)

    return rawData ? rawData.map((staff: any) => new ClubStaff(this.client, staff)) : undefined
  }

  public async getRelations (clubId: number): Promise<ClubRelations | undefined> {
    const rawData = await this.requestPaginated(`clubs/${clubId}/relations`)

    return rawData ? new ClubRelations(this.client, rawData) : undefined
  }
}
