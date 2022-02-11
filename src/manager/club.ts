import { BaseManager } from '../manager/base'
import { Club, ClubMember } from '../resource/club'
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
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (data: any) {
    return super.storeCache(`clubs/${data.mal_id}`, data)
  }

  public async search (searchString: string, filter?: Partial<ClubSearchFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginatedResource('clubs', offset, maxCount, {
      [searchString.length === 1 ? 'letter' : 'q']: searchString,
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'orderBy': return ['order_by', value]

          default: return [key, `${value}`]
        }
      })
    })

    return rawData.map((data) => this.storeCache(data)).map((club) => new Club(this.client, club))
  }

  public async get (clubId: number): Promise<Club | null | undefined> {
    const rawData = await this.requestResource(`clubs/${clubId}`)

    if (rawData) {
      return new Club(this.client, rawData)
    } else {
      return rawData === null ? null : undefined
    }
  }

  public async getMembers (clubId: number): Promise<Array<ClubMember> | undefined> {
    const rawData = await this.requestPaginatedResource(`clubs/${clubId}/members`)

    return rawData ? rawData.map((member: any) => new ClubMember(this.client, clubId, member)) : undefined
  }
}
