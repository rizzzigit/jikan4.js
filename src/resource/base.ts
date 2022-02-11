import { Client } from '../core/client'
import { URL } from 'url'

export class BaseClass {
  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseDate<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? Date : (Date | null) {
    const date = new Date(input || '')

    if (Number.isNaN(date.getTime())) {
      if (nullable) {
        return <any> null
      } else {
        throw new Error('Invalid date')
      }
    }

    return date
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseString<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? string : (string | null) {
    input = input?.trim()

    if (!input) {
      if (nullable) {
        return <any> null
      } else {
        throw new Error('Invalid string')
      }
    } else {
      return input
    }
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseNumber<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? number : (number | null) {
    const number = Number(input)

    if (Number.isNaN(number)) {
      if (nullable) {
        return <any> null
      } else {
        throw new Error('Invalid number')
      }
    } else {
      return Number(input)
    }
  }

  // eslint-disable-next-line tsdoc/syntax
  /** @hidden */
  public static parseURL<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? URL : (URL | null) {
    let url: URL | null = null

    try {
      if (input) {
        url = new URL(input)
      }
    } catch (error) {
    }

    if (!url) {
      if (nullable) {
        return <any> null
      } else {
        throw new Error(`Invalid URL: ${input}`)
      }
    } else {
      return url
    }
  }

  public readonly client: Client

  public constructor (client: Client) {
    this.client = client

    Object.defineProperty(this, 'client', { enumerable: false, value: client })
  }
}

export class BaseResource extends BaseClass {
  public readonly id: number
  public readonly url: URL

  public constructor (client: Client, data: any) {
    super(client)

    this.id = BaseResource.parseNumber(data.mal_id)
    this.url = BaseResource.parseURL(data.url)
  }
}
