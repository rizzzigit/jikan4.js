import { Client } from '../core/client'
import { BaseClass } from './base'

export type SeasonType =
  | 'Winter'
  | 'Spring'
  | 'Summer'
  | 'Fall'
  | 'Unknown'

export class Season extends BaseClass {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private static parseSeasonType (input: any): SeasonType {
    switch (`${input}`.trim()) {
      case 'winter': return 'Winter'
      case 'spring': return 'Spring'
      case 'summer': return 'Summer'
      case 'fall': return 'Fall'

      default: return 'Unknown'
    }
  }

  public readonly year: number
  public readonly seasons: Array<SeasonType>

  public constructor (client: Client, rawData: any) {
    super(client)

    this.year = rawData.year
    this.seasons = rawData.seasons?.map((season: any) => Season.parseSeasonType(season)) || []
  }
}
