import { Client } from '../core/client'
import { Image, YoutubeVideo } from './misc'

export class BaseClass {
  /** @hidden */
  public static parseImage (data: any): Image {
    return {
      small: this.parseURL(data?.small_image_url, true),
      default: this.parseURL(data?.image_url, true),
      medium: this.parseURL(data?.medium_image_url, true),
      large: this.parseURL(data?.large_image_url, true),
      maximum: this.parseURL(data?.maximum_image_url, true)
    }
  }

  /** @hidden */
  public static parseYoutubeVideo (data: any): YoutubeVideo {
    return {
      id: data.youtube_id,
      url: `https://youtu.be/${data.youtube_id}`,
      embedUrl: `https://www.youtube.com/embed/${data.youtube_id}`,
      image: this.parseImage(data.images)
    }
  }

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

  /** @hidden */
  public static parseURL<IsNullable extends boolean = false> (input: any, nullable: IsNullable = <any> false): IsNullable extends false ? string : (string | null) {
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
      return url.toString()
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
  public readonly url: string

  public constructor (client: Client, data: any) {
    super(client)

    this.id = data.mal_id
    this.url = BaseResource.parseURL(data.url)
  }
}
