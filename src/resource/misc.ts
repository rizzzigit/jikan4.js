import { BaseClass } from './base'
import { URL } from 'url'
import { Client } from '../core/client'

export class Image extends BaseClass {
  public readonly small: URL | null
  public readonly medium: URL | null
  public readonly large: URL | null

  public constructor (client: Client, data: any) {
    super(client)

    this.small = Image.parseURL(data?.small_image_url, true)
    this.medium = Image.parseURL(data?.image_url || data?.medium_image_url, true)
    this.large = Image.parseURL(data?.maximum_image_url || data?.large_image_url, true)
  }
}

export class YoutubeVideo extends BaseClass {
  public readonly id: string
  public readonly url: URL
  public readonly embedUrl: URL
  public readonly image: Image

  public constructor (client: Client, data: any) {
    super(client)

    this.id = data.youtube_id
    this.url = new URL(`https://youtu.be/${data.youtube_id}`)
    this.embedUrl = new URL(`https://www.youtube.com/embed/${this.id}`)
    this.image = new Image(client, data.images)
  }
}
