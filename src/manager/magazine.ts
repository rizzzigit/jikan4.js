import { MagazineMeta } from '../resource/meta'
import { BaseManager } from './base'

export class MagazineManager extends BaseManager {
  public async list (offset?: number, maxCount?: number) {
    const responseData = <Array<any>> await this.requestPaginatedResource('magazines', offset, maxCount)

    return responseData.map((data: any) => new MagazineMeta(this.client, data))
  }
}
