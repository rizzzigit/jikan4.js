import { Client } from './client'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { URL } from 'url'
import { APIRequestData, APIRequestQuery, APIResponseData } from './api'

export class CacheManager {
  public readonly client: Client

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private get cacheDir () {
    const { client: { options: { dataPath } } } = this

    return join(dataPath, 'cache')
  }

  // eslint-disable-next-line tsdoc/syntax
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

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private isExpired (date: number): boolean {
    const { client: { options } } = this

    return (date + options.dataExpiry) < Date.now()
  }

  public get (requestData: APIRequestData) {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (existsSync(file)) {
      const fileContents = JSON.parse(`${readFileSync(file)}`)

      if (!this.isExpired(fileContents.date)) {
        return <APIResponseData> fileContents.data
      }
    }
  }

  public set (requestData: APIRequestData, rawData: APIResponseData) {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (rawData) {
      const data = {
        data: rawData,
        date: Date.now()
      }

      const baseFile = dirname(file)
      if (!existsSync(baseFile)) {
        mkdirSync(baseFile, { recursive: true })
      }
      writeFileSync(file, JSON.stringify(data, undefined, '  '))
    }

    return rawData
  }

  public has (requestData: APIRequestData) {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (existsSync(file)) {
      const data = JSON.parse(`${readFileSync(file)}`)

      return !this.isExpired(data.date)
    }

    return false
  }

  public delete (requestData: APIRequestData) {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (existsSync(file)) {
      unlinkSync(file)
    }
  }

  public default (requestData: APIRequestData, rawData: any) {
    const { path, query } = requestData
    const file = this.file(path, query)

    if (existsSync(file)) {
      const data = JSON.parse(`${readFileSync(file)}`)

      if (!this.isExpired(data.date)) {
        return data.data
      }
    }

    const data = {
      data: rawData,
      date: Date.now()
    }

    writeFileSync(file, JSON.stringify(data, undefined, '  '))
  }

  public constructor (client: Client) {
    this.client = client
  }
}
