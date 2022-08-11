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
  public async list (day?: ScheduleDay, offset?: number, maxCount?: number): Promise<Array<Anime>>
  public async list (day?: ScheduleDay, filter?: Partial<ScheduleFilter>, offset?: number, maxCount?: number): Promise<Array<Anime>>
  public async list (arg0?: ScheduleDay, arg1?: Partial<ScheduleFilter> | number, arg2?: number, arg3?: number) {
    const { day, filter, offset, maxCount } = (() => {
      const day = arg0
      let filter: Partial<ScheduleFilter> | undefined
      let offset: number | undefined
      let maxCount: number | undefined

      if (typeof (arg1) === 'number') {
        offset = arg1
        maxCount = arg2
      } else {
        filter = arg1
        offset = arg2
        maxCount = arg3
      }

      return { day, filter, offset, maxCount }
    })()

    const rawData = <Array<any>> await this.requestPaginated(`schedules${day ? `/${day}` : ''}`, offset, maxCount, {
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
