import { Client } from '../core/client'
import { BaseClass } from '../resource/base'
import { APIClient, APIRequestQuery } from '../core/api'

export interface Result<Paginated extends boolean = false> {
  path: string
  query: APIRequestQuery
  data: Paginated extends true ? Array<any> : any
}

export class BaseManager extends BaseClass {
  protected APIClient: APIClient

  /** @hidden */
  private debug (message: string) {
    this.client.debug('Content Manager', message)
  }

  /** @hidden */
  protected async request (path: string, query?: APIRequestQuery) {
    this.debug(`Get content ${path}`)

    const responseData = await this.APIClient.request({ path, cache: query ? !('disableCaching' in query) : true, query })
    switch (responseData.status) {
      case 418: return null
      case 200: return responseData.body.data

      default: return undefined
    }
  }

  /** @hidden */
  protected async requestPaginated (path: string, offset = 0, maxCount = this.client.options.dataPaginationMaxSize, query?: APIRequestQuery) {
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

      const responseData = await this.APIClient.request({ path, cache: query ? !('disableCaching' in query) : true, query: { ...query, page: `${page}` } })
      const { pagination, body, status } = responseData
      is200 = status === 200

      if (Array.isArray(body.data)) {
        data.push(...body.data)

        hasNext = pagination?.hasNext || false
        lastPage = pagination?.last || 0
      }

      const end = fetchEnd()

      if (end && (data.length >= end)) {
        break
      }
    } while (is200 && hasNext)

    return data.length || is200 ? data.slice(offset, fetchEnd()) : undefined
  }

  public constructor (client: Client) {
    super(client)

    this.APIClient = client.APIClient
  }
}
