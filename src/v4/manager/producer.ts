import { Producer, ProducerFull } from '../resource/producer'
import { BaseManager } from './base'

export class ProducerManager extends BaseManager {
  public async list (offset?: number, maxCount?: number) {
    const responseData = <Array<any>> await this.requestPaginated('producers', offset, maxCount)

    return responseData.map((data: any) => new Producer(this.client, data))
  }

  public async get (producerId: number) {
    const rawData = await this.request(`producers/${producerId}`)

    return rawData ? new Producer(this.client, rawData) : undefined
  }

  public async getFull (producerId: number) {
    const rawData = await this.request(`producers/${producerId}/full`)

    return rawData ? new ProducerFull(this.client, rawData) : undefined
  }

  public async getExternal (producerId: number) {
    const rawData = await this.request(`producers/${producerId}/external`)

    return rawData ? rawData.map((entry: any) => Object.assign(entry, { url: new URL(entry.url) })) : undefined
  }
}
