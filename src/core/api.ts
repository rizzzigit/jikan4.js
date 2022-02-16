import { Client } from '../core/client'
import { URL } from 'url'
import { waitUntil, sleep } from '../utils'
import HTTP from 'http'
import HTTPS from 'https'
import { CacheManager } from './cache'

export interface APIRequestQuery {
  disableCaching?: any

  [key: string]: string | undefined
}

export class APIResponseData {
  private static parsePagination (url: URL, paginationData: any) {
    const current = Number(url.searchParams.get('page')) || 1
    const last = paginationData?.last_visible_page || 1
    const hasNext = paginationData?.has_next_page || false

    return { current, last, hasNext }
  }

  public readonly data?: any
  public readonly date: number
  public readonly status: number
  public readonly headers: HTTP.IncomingHttpHeaders
  public readonly pagination?: {
    current: number
    last: number

    hasNext: boolean
  }

  public constructor (status: number | undefined, url: URL, headers: HTTP.IncomingHttpHeaders, data: any) {
    this.date = Date.now()
    this.status = status || 200
    this.headers = headers

    if (this.status === 200) {
      if (data?.data) {
        this.pagination = data.pagination ? APIResponseData.parsePagination(url, data.pagination) : undefined
        this.data = data?.data
      } else {
        this.data = data
      }
    } else if (this.status === 500) {
      this.data = data
    }
  }
}

export interface APIRequestQueueEntry {
  url: URL

  resolve: (data: APIResponseData) => void
  reject: (error: Error) => void
}

export class APIRequestQueue extends Array<APIRequestQueueEntry> {
  public readonly APIClient: APIClient
  public readonly client: Client
  public isRunning: boolean
  public lastRequest: number
  public warningEmitted: boolean

  public get nextRequest () {
    return this.lastRequest + this.APIClient.client.options.dataRateLimit
  }

  private debug (message: string) {
    this.APIClient.client.debug('Request Queue', message)
  }

  public async runQueue () {
    const { client: { options: { maxApiErrorRetry } } } = this

    this.debug('Run request queue')
    this.isRunning = true

    do {
      const entry = this.shift()

      if (entry) {
        this.debug(`Shift one entry from the queue, new queue size is ${this.length}`)
        let currentTry = 1

        while (currentTry <= maxApiErrorRetry) {
          try {
            entry.resolve(await this.APIClient.executeRequest(entry.url))

            break
          } catch (error: any) {
            if ((error.status !== 500) || (currentTry > maxApiErrorRetry)) {
              throw error
            } else {
              this.debug(`${error.message}, retry no. ${currentTry}`)
            }
          }

          currentTry++
        }
      } else {
        this.debug('Queue is now empty')
        this.isRunning = false
      }
    } while (this.isRunning)

    this.debug('Request queue done')
  }

  public push (queueEntry: APIRequestQueueEntry): number {
    const { client: { options: { requestQueueLimit } } } = this

    if (requestQueueLimit && (requestQueueLimit <= this.length)) {
      throw new Error(`Request queue has reached the limit (${requestQueueLimit})`)
    }

    super.push(queueEntry)

    this.debug(`Add new queue entry: ${queueEntry.url}, new queue size is ${this.length}`)
    if (!this.isRunning) {
      this.runQueue()
    }

    return this.length
  }

  public constructor (APIClient: APIClient) {
    super()

    this.APIClient = APIClient
    this.client = APIClient.client
    this.isRunning = false
    this.lastRequest = 0
    this.warningEmitted = false
  }
}

export class APIError extends Error {
  public readonly status: number
  public readonly errorType: string
  public readonly error: string
  public readonly trace: string
  public readonly reportURL: string
  public readonly referenceURL: string

  public constructor (message: string, referenceURL: string, response: APIResponseData) {
    super(message)

    this.status = response.data.status
    this.errorType = response.data.type
    this.error = response.data.error
    this.trace = response.data.trace
    this.reportURL = response.data.report_url
    this.referenceURL = referenceURL
  }
}

export class APIClient {
  public readonly cacheManager: CacheManager

  public parseURL (path: string, query?: APIRequestQuery) {
    const { client: { options } } = this

    if (!path) {
      path = ''
    }

    const parsedURL = new URL(`http${options.secure ? 's' : ''}://${options.host}/${options.baseUri}${path.length ? '/' : ''}${path}`)

    if (query) {
      const params = parsedURL.searchParams

      for (const queryKey in query) {
        const queryEntry = query[queryKey]

        if (queryEntry !== undefined) {
          params.set(queryKey, queryEntry)
        }
      }
    }

    return parsedURL
  }

  public readonly client: Client
  public readonly queue: APIRequestQueue

  private debug (message: string) {
    return this.client.debug('API Client', message)
  }

  public async request (path: string, query?: APIRequestQuery): Promise<APIResponseData> {
    const { cacheManager } = this
    const url = this.parseURL(path, query)

    if (this.isCachingEnabled(url) && cacheManager.has(url)) {
      return cacheManager.get(url)
    }

    return await new Promise((resolve, reject) => this.queue.push({
      url, resolve, reject
    }))
  }

  public isCachingEnabled (url: URL) {
    return !(this.client.options.disableCaching || url.searchParams.has('disableCaching'))
  }

  public async executeRequest (url: URL): Promise<APIResponseData> {
    const { client: { options }, cacheManager } = this
    const isCachingEnabled = this.isCachingEnabled(url)

    if (isCachingEnabled && cacheManager.has(url)) {
      return cacheManager.get(url)
    }

    if (this.queue.nextRequest > Date.now()) {
      this.debug(`Wait ${this.queue.nextRequest - Date.now()} ms before requesting`)
      await waitUntil(this.queue.nextRequest)
    }

    this.queue.lastRequest = Date.now()
    const responseData: APIResponseData = await new Promise((resolve, reject: (error: Error | APIError) => void) => {
      const callREST = () => new Promise((resolve: (data: APIResponseData) => void, reject: (error: Error) => void) => {
        const request = (url.protocol === 'https:' ? HTTPS : HTTP).request(`${url}`)
        const requestTimeout = async () => {
          await sleep(options.requestTimeout)

          if (!(request.destroyed || request.socket?.destroyed)) {
            request.destroy(new Error(`${options.requestTimeout} ms timeout`))
          }
        }

        request.on('error', reject)
        request.on('response', async (response) => {
          let responseText: string = ''

          response.on('error', reject)
          response.on('data', (chunk) => (responseText += chunk))
          response.on('end', async () => {
            const deserialized = await (async () => JSON.parse(responseText))().catch(() => ({}))
            deserialized.status = !deserialized.status ? response.statusCode : deserialized.status

            resolve(new APIResponseData(deserialized.status, url, response.headers, deserialized))
          })
        })

        requestTimeout()
        this.debug(`HTTP GET ${url}`)
        request.end()
      })

      callREST()
        .then((response) => {
          switch (response.status) {
            case 418:
            case 200:
            case 404:
              resolve(response)
              break

            default:
              reject(new APIError(`HTTP ${response.status} hit on ${url}`, `${url}`, response))
          }
        })
        .catch(reject)
    })

    if (isCachingEnabled) {
      cacheManager.set(url, responseData)
    }
    return responseData
  }

  public constructor (client: Client) {
    this.client = client
    this.queue = new APIRequestQueue(this)
    this.cacheManager = new CacheManager(client)
  }
}
