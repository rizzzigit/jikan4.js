import { Anime } from '../resource/content/anime'
import { translateObject } from '../utils'
import { BaseManager } from './base'

export type ScheduleDay =
  | 'monday'
  | 'tursday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'sunday'
  | 'saturday'

export interface ScheduleFilter {
  sfw: boolean
  kids: boolean
}

export class ScheduleManager extends BaseManager {
  public async list (day?: ScheduleDay, filter?: Partial<ScheduleFilter>, offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`schedules${day ? `/${day}` : ''}`, offset, maxCount, {
      disableCaching: 'true',
      ...filter && translateObject(filter, (key, value) => {
        switch (key) {
          case 'kids':
          case 'sfw':
            return value && [key, 'true']
        }
      })
    })

    return rawData.map((data: any) => new Anime(this.client, this.client.anime.storeCache(data)))
  }
}
