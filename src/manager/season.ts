import { Anime } from '../resource/content/anime'
import { Season, SeasonType } from '../resource/season'
import { BaseManager } from './base'

export class SeasonManager extends BaseManager {
  public async list (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('seasons', offset, maxCount)

    return rawData.map((data: any) => new Season(this.client, data))
  }

  public async getUpcoming (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('seasons/upcoming', offset, maxCount, { disableCaching: 'true' })

    return rawData.map((data: any) => new Anime(this.client, data))
  }

  public async get (season: SeasonType, year: number = new Date().getFullYear(), offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated(`seasons/${year}/${season.toLowerCase()}`, offset, maxCount)

    return rawData.map((data: any) => new Anime(this.client, data))
  }

  public async getNow (offset?: number, maxCount?: number) {
    const rawData = <Array<any>> await this.requestPaginated('seasons/now', offset, maxCount, { disableCaching: 'true' })

    return rawData.map((data: any) => this.client.anime.storeCache(data)).map((data: any) => new Anime(this.client, data))
  }
}
