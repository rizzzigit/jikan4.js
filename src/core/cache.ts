import { Client } from './client'
import { dirname, join } from 'path'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { URL } from 'url'

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
  private file (url: URL) {
    const path: Array<string> = [this.cacheDir, url.pathname]

    if (url.search.length) {
      path.push(`_q_${Buffer.from(url.search).toString('hex')}`)
    }

    return `${join(...path)}.json`
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  private isExpired (date: number): boolean {
    const { client: { options } } = this

    return (date + options.dataExpiry) < Date.now()
  }

  public get (url: URL) {
    const file = this.file(url)

    if (existsSync(file)) {
      const data = JSON.parse(`${readFileSync(file)}`)

      if (!this.isExpired(data.date)) {
        return data.data
      }
    }
  }

  public set (url: URL, rawData: any) {
    const file = this.file(url)

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

  public has (url: URL) {
    const file = this.file(url)

    if (existsSync(file)) {
      const data = JSON.parse(`${readFileSync(file)}`)

      return !this.isExpired(data.date)
    }

    return false
  }

  public delete (url: URL) {
    const file = this.file(url)

    if (existsSync(file)) {
      unlinkSync(file)
    }
  }

  public default (url: URL, rawData: any) {
    const file = this.file(url)

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
