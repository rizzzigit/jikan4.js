import HTTP from 'http'
import HTTPS from 'https'
import Path from 'path'

import { Client } from '../core/client'
import { waitUntil } from '../utils'
import { CacheManager } from './cache'

const isBrowser = typeof window !== 'undefined'

export interface APIRequestQuery {
  disableCaching?: string

  [key: string]: string | boolean | undefined
}

export interface APIRequestData {
  path: string
  query?: APIRequestQuery
  cache?: boolean
}

export class APIResponseData {
  private static parsePagination (url: URL, paginationData: any) {
    const current = Number(url.searchParams.get('page')) || 1
    const last = paginationData?.last_visible_page || 1
    const hasNext = paginationData?.has_next_page || false

    return { current, last, hasNext }
  }

  public constructor (status: number, url: URL, headers: HTTP.IncomingHttpHeaders, body: any) {
    this.time = Date.now()
    this.url = `${url.href}`
    this.status = status || 200
    this.headers = headers
    this.body = body
    this.pagination = body?.pagination
      ? APIResponseData.parsePagination(url, body.pagination)
      : undefined
  }

  public readonly url: string
  public readonly status: number
  public readonly body: any
  public readonly time: number
  public readonly headers: HTTP.IncomingHttpHeaders
  public readonly pagination?: {
    current: number
    last: number
    hasNext: boolean
  }
}

export class APIError extends Error {
  public constructor (response: APIResponseData) {
    const { status, url: referenceUrl, body: { type, message, error, trace, report_url: reportUrl } } = response
    if (!error) {
      throw new Error('Invalid error data')
    }

    super(`HTTP ${status} Hit: ${message}`)

    this.status = status
    this.errorType = type
    this.error = error
    this.trace = trace
    this.reportUrl = reportUrl
    this.referenceUrl = referenceUrl
    this.response = response
  }

  public readonly status: number
  public readonly errorType: string
  public readonly error: string
  public readonly trace: string
  public readonly reportUrl: string
  public readonly referenceUrl: string
  public readonly response: APIResponseData
}

export class APIClient {
  public constructor (client: Client) {
    this.client = client
    this.queue = []

    const { options: { disableCaching, dataPath } } = client
    this.cache = (!disableCaching) && (dataPath != null)
      ? new CacheManager(client)
      : undefined

    this.lastRequest = 0
    this.isQueueRunning = false
    this.agent = isBrowser
      ? {}
      : (() => {
          const { options: { keepAlive, keepAliveMsecs } } = client
          const options = { keepAlive, keepAliveMsecs }

          return {
            http: new HTTP.Agent(options),
            https: new HTTPS.Agent(options)
          }
        })()
  }

  public readonly client: Client
  public readonly queue: Array<{
    requestData: APIRequestData

    resolve: (data: APIResponseData) => void
    reject: (error: Error | APIError) => void
  }>

  public readonly cache?: CacheManager
  public readonly agent: {
    http?: HTTP.Agent
    https?: HTTPS.Agent
  }

  /** @hidden */
  private newRequestInstance (secure: boolean, url: URL, options: HTTP.RequestOptions | HTTPS.RequestOptions) {
    const { agent } = this

    if (secure) {
      return HTTPS.request(url.toString(), { ...options, agent: agent.https })
    }

    return HTTP.request(url.toString(), { ...options, agent: agent.http })
  }

  /** @hidden */
  private lastRequest: number

  /** @hidden */
  private get nextRequest (): number {
    const { client: { options: { dataRateLimit } }, lastRequest } = this

    return lastRequest + dataRateLimit
  }

  /** @hidden */
  private async awaitNextRequest () {
    const { nextRequest } = this

    if (nextRequest > Date.now()) {
      this.debug(`Wait ${nextRequest - Date.now()} ms before requesting`)
      await waitUntil(nextRequest)
    }
  }

  /** @hidden */
  private isQueueRunning: boolean

  /** @hidden */
  private async runQueue () {
    if (this.isQueueRunning) {
      return
    }

    this.isQueueRunning = true
    try {
      const { queue } = this

      while (queue.length) {
        const entry = <this['queue'][0]> queue.shift()
        this.debug(`Queue size update: ${queue.length}`)
        const { requestData, resolve, reject } = entry

        try {
          const responseData = await this.execReqeust(requestData)
          const { path, query } = requestData

          for (let queueIndex = 0; queue.length > queueIndex; queueIndex++) {
            const otherEntry = queue[queueIndex]
            if (!otherEntry.requestData.cache) {
              continue
            }

            const { requestData: { path: otherPath, query: otherQuery }, resolve: otherResolve } = otherEntry
            if (JSON.stringify([otherPath, otherQuery]) === JSON.stringify([path, query])) {
              queue.splice(queueIndex--, 1)

              otherResolve(responseData)
            }
          }

          resolve(responseData)
        } catch (error: any) {
          reject(error)
        }
      }
    } finally {
      this.isQueueRunning = false
    }
  }

  /** @hidden */
  private addQueue (requestData: APIRequestData, resolve: (data: APIResponseData) => void, reject: (error: Error | APIError) => void) {
    const { queue } = this
    queue.push({ requestData, resolve, reject })
    this.debug(`Queue size update: ${queue.length}`)

    if (!this.isQueueRunning) {
      this.runQueue()
    }
  }

  /** @hidden */
  private debug (message: string) {
    return this.client.debug('API Client', message)
  }

  public constructURL (requestData: APIRequestData) {
    const { client: { options: { host, baseUri, secure } } } = this
    const { path, query } = requestData
    const url = new URL(`http${secure ? 's' : ''}://${host}${((path) => `${path.startsWith('/') ? '' : '/'}${path}`)(isBrowser ? `${baseUri}/${path}` : Path.join(baseUri, path))}`)
    const { searchParams } = url

    if (query) {
      for (const queryKey in query) {
        const { [queryKey]: queryEntry } = query

        if (queryEntry != null) {
          if (typeof (queryEntry) === 'boolean' && queryEntry) {
            searchParams.set(queryKey, '')
          } else {
            searchParams.set(queryKey, `${queryEntry}`);
          }
        }
      }
    }

    return url
  }

  public async request (requestData: APIRequestData) {
    const { cache } = this

    if ((requestData.cache !== undefined ? requestData.cache : true) && await cache?.has(requestData)) {
      return <APIResponseData> await cache?.get(requestData)
    }

    return await new Promise<APIResponseData>((resolve, reject) => this.addQueue(requestData, resolve, reject))
  }

  /** @hidden */
  private async execReqeust (requestData: APIRequestData) {
    const { client: { options: { secure, requestTimeout, maxApiErrorRetry, retryOnApiError } }, cache } = this
    const url = this.constructURL(requestData)
    const cachingEnabled = requestData.cache !== undefined ? requestData.cache : true

    const processResponse = async (responseData: APIResponseData, resolve: (responseData: APIResponseData) => void, reject: (reason: any) => void) => {
      if (responseData.headers.location != null)
      {
        this.execReqeust({
          cache: requestData.cache,
          path: new URL(responseData.headers.location).pathname,
          query: requestData.query
        }).then(resolve, reject)
      } else if ([418, 200, 404].includes(responseData.status)) {
        if (cachingEnabled) {
          await cache?.set(requestData, responseData)
        }

        resolve(responseData)
      } else if (responseData.status === 429) {
        reject(new APIError(Object.assign(responseData, {
          body: Object.assign(responseData.body, {
            error: 'Rate limited'
          })
        })))
      } else {
        reject(new APIError(responseData))
      }
    }

    // eslint-disable-next-line no-async-promise-executor
    const run = () => new Promise<APIResponseData>(async (resolve, reject) => {
      if (cachingEnabled && await cache?.has(requestData)) {
        return cache?.get(requestData)
      }

      this.lastRequest = Date.now()
      this.debug(`HTTP GET ${url}`)
      const request = this.newRequestInstance(secure, url, { timeout: requestTimeout })
      request.on('error', reject)
      request.on('timeout', () => request.destroy(new Error(`${requestTimeout} ms timeout`)))
      request.on('response', async (response) => {
        response.on('error', reject)
        const bufferSink: Array<Buffer> = []

        for await (const buffer of response) {
          bufferSink.push(buffer)
        }

        let body

        try {
          body = JSON.parse(Buffer.concat(bufferSink).toString('utf-8'))
        } catch {
          body = {}
        }
        const responseData = new APIResponseData(Number(body.status || response.statusCode), url, response.headers, body)

        processResponse(responseData, resolve, reject)
      })

      request.end()
    })

    const runBrowser = () => new Promise<APIResponseData>((resolve, reject) => {
      this.lastRequest = Date.now()
      this.debug(`HTTP GET ${url}`)

      const request = new XMLHttpRequest()

      request.open('GET', url)
      request.timeout = requestTimeout

      request.onerror = () => {}
      request.ontimeout = () => reject(new Error(`${requestTimeout} ms timeout`))
      request.onloadend = () => {
        const body = JSON.parse(request.responseText)
        const responseData = new APIResponseData(Number(body.status || request.status), url, (() => {
          const data: { [key: string]: string } = {}

          for (const entry of request.getAllResponseHeaders().split('\n')) {
            const [name, ...value] = entry.trim().split(':')
            data[name.trim()] = value.join(':').trim()
          }

          return data
        })(), body)

        processResponse(responseData, resolve, reject)
      }

      request.send(null)
    })

    return await new Promise<APIResponseData>((resolve, reject) => {
      let retry: number = 0
      const exec = async () => {
        await this.awaitNextRequest()
        await (isBrowser ? runBrowser() : run())
          .then(resolve)
          .catch((error) => {
            if (!(
              retryOnApiError &&
              (retry <= maxApiErrorRetry) &&
              (
                error.response
                  ? (
                      (error.response.status >= 500) &&
                      (error.response.status < 600)
                    )
                  : true
              )
            )) {
              reject(error)
            } else {
              retry++
              exec()
            }
          })
      }

      exec()
    })
  }
}
