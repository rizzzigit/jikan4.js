import { Client } from './client'
import { dirname, join } from 'path'
// import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { APIRequestData, APIRequestQuery, APIResponseData } from './api'

export class CacheManager {
  public readonly client: Client
  #fs: typeof import('fs') | null | undefined

  /** @hidden */
  private async fs(): Promise<typeof import('fs') | null> {
    if (this.#fs === undefined && typeof process !== 'undefined' && typeof window === 'undefined') {
      try {
        this.#fs = require('fs')
      }
      catch {
        this.#fs = null
      }
    }

    return this.#fs ?? null
  }

  /** @hidden */
  private get cacheDir () {
    const { client: { options: { dataPath } } } = this

    if (dataPath == null) {
      throw new Error('client.options.dataPath is not set')
    }

    return join(dataPath, 'cache')
  }

  /** @hidden */
  private file (path: string, query?: APIRequestQuery) {
    const pathArray: Array<string> = [this.cacheDir, path]
    const url = new URL(`https://asd${path || '/'}`)
    const { searchParams } = url

    if (query) {
      for (const queryKey in query) {
        const { [queryKey]: queryEntry } = query

        if (queryEntry) {
          searchParams.set(queryKey, queryEntry)
        }
      }
    }

    const { search } = url
    if (search.length) {
      pathArray.push(`_q_${Buffer.from(search).toString('hex')}`)
    }

    return `${join(...pathArray)}.json`
  }

  /** @hidden */
  private isExpired (date: number): boolean {
    const { client: { options } } = this

    return (date + options.dataExpiry) < Date.now()
  }

  public async get (requestData: APIRequestData): Promise<APIResponseData | undefined> {
    const { path, query } = requestData
    const file = this.file(path, query)

    const fs = await this.fs()
    if (fs && fs.existsSync(file)) {
      const fileContents = JSON.parse(`${await fs.promises.readFile(file)}`)

      if (!this.isExpired(fileContents.date)) {
        return <APIResponseData>fileContents.data
      }
    }
  }

  public async set(requestData: APIRequestData, rawData: APIResponseData): Promise<APIResponseData> {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (rawData) {
      const data = {
        data: rawData,
        date: Date.now()
      }

      const fs = await this.fs()
      if (fs) {
        const baseFile = dirname(file)
        if (!fs.existsSync(baseFile)) {
          await fs.promises.mkdir(baseFile, { recursive: true })
        }

        await fs.promises.writeFile(file, JSON.stringify(data, undefined, '  '))
      }

    }

    return rawData
  }

  public async has (requestData: APIRequestData): Promise<boolean> {
    const { path, query } = requestData
    const file = this.file(path, query)

    const fs = await this.fs()
    if (fs && fs.existsSync(file)) {
      const data = JSON.parse(`${await fs.promises.readFile(file)}`)

      return !this.isExpired(data.date)
    }

    return false
  }

  public async delete (requestData: APIRequestData): Promise<void> {
    const { path, query } = requestData
    const file = this.file(path, query)

    const fs = await this.fs()
    if (fs) {
      if (fs.existsSync(file)) {
        await fs.promises.unlink(file)
      }
    }
  }

  public async default (requestData: APIRequestData, rawData: any): Promise<void> {
    const { path, query } = requestData
    const file = this.file(path, query)

    const fs = await this.fs()
    if (fs) {
      if (fs.existsSync(file)) {
        const data = JSON.parse(`${fs.promises.readFile(file)}`)

        if (!this.isExpired(data.date)) {
          return data.data
        }
      }

      const data = {
        data: rawData,
        date: Date.now()
      }

      fs.promises.writeFile(file, JSON.stringify(data, undefined, '  '))
    }
  }

  public constructor (client: Client) {
    this.client = client
  }
}
