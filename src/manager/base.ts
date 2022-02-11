import { Client } from '../core/client'
import { BaseClass } from '../resource/base'
import { APIClient, APIRequestQuery } from '../core/api'

export class BaseManager extends BaseClass {
  protected APIClient: APIClient

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private debug (message: string) {
    this.client.debug('Content Manager', message)
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  protected async requestResource (path: string, query?: APIRequestQuery) {
    this.debug(`Get content ${path}`)
    const responseData = await this.APIClient.request(path, query)

    switch (responseData.status) {
      case 418: return null
      case 200: return responseData.data

      default: return undefined
    }
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  protected async requestPaginatedResource (path: string, offset = 0, maxCount = this.client.options.dataPaginationMaxSize, query?: APIRequestQuery) {
    const data: Array<any> = []
    const maxCountValid = maxCount > 0

    const fetchEnd = () => maxCountValid ? offset + maxCount : undefined

    let page = 0
    let is200 = true
    let hasNext: boolean = true
    let lastPage: number | null = null

    do {
      page++
      this.debug(`Get content ${path} page #${page}${lastPage !== null ? ` of ${lastPage}` : ''}`)

      const responseData = await this.APIClient.request(path, Object.assign({}, query, { page }))
      const { pagination } = responseData

      is200 = responseData.status === 200

      if (Array.isArray(responseData.data)) {
        data.push(...responseData.data)

        hasNext = pagination?.hasNext || false
        lastPage = pagination?.last || 0
      }

      const end = fetchEnd()

      if (end && (data.length > end)) {
        break
      }
    } while (is200 && hasNext)

    return data.length || is200 ? data.slice(offset, fetchEnd()) : undefined
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public storeCache (path: string, data: any, query?: APIRequestQuery) {
    const { APIClient, APIClient: { cacheManager } } = this

    return cacheManager.set(APIClient.parseURL(path, query), data)
  }

  public constructor (client: Client) {
    super(client)

    this.APIClient = client.APIClient
  }
}
