import { BaseClass } from './base'
import { Client } from '../core/client'

export class Image extends BaseClass {
  public readonly small: URL | null
  public readonly default: URL | null
  public readonly medium: URL | null
  public readonly large: URL | null
  public readonly maximum: URL | null

  public getOrFallback(sizes: Array<'small' | 'default' | 'medium' | 'large' | 'maximum'>): URL | null {
    for (const sizeEntry of sizes) {
      if (this[sizeEntry] != null) {
        return this[sizeEntry]
      }
    }

    return null
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.small = Image.parseURL(data?.small_image_url, true)
    this.default = Image.parseURL(data?.image_url, true)
    this.medium = Image.parseURL(data?.medium_image_url, true)
    this.large = Image.parseURL(data?.large_image_url, true)
    this.maximum = Image.parseURL(data?.maximum_image_url, true)
  }
}

export class ImageFormatCollection extends BaseClass {
  public readonly jpg: Image | null
  public readonly webp: Image | null

  public getOrFallback(formats: Array<'jpg' | 'webp'>, sizes: Parameters<Image['getOrFallback']>[0]) : URL | null
  public getOrFallback(formats: Array<'jpg' | 'webp'>) : Image | null
  public getOrFallback(formats: Array<'jpg' | 'webp'>, sizes?: Parameters<Image['getOrFallback']>[0]) : Image | URL | null {
    for (const formatEntry of formats) {
      if (this[formatEntry] != null) {
        if (sizes != null) {
          return this[formatEntry]?.getOrFallback(sizes) ?? null
        }

        return this[formatEntry]
      }
    }

    return null
  }

  public constructor (client: Client, data: any) {
    super(client)

    this.jpg = data.jpg != null ? new Image(client, data.jpg) : null
    this.webp = data.webp != null ? new Image(client, data.webp) : null
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

export interface Link {
  name: string
  url: URL
}
