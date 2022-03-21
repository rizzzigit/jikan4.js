import { ProducerMeta } from '../resource/meta'
import { BaseManager } from './base'

export class ProducerManager extends BaseManager {
  public async list (offset?: number, maxCount?: number) {
    const responseData = <Array<any>> await this.requestPaginated('producers', offset, maxCount)

    return responseData.map((data: any) => new ProducerMeta(this.client, data))
  }
}
