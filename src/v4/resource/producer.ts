import { Client } from '../core/client'
import { BaseResource } from './base'
import { ContentTitle, TitleArray } from './content/base'
import { ImageFormatCollection, Link } from './misc'

export class Producer extends BaseResource {
  public constructor (client: Client, data: any) {
    super(client, data)

    this.title = new ContentTitle(client, data.titles)
    this.titles = data.titles
    this.image = new ImageFormatCollection(client, data.images)
    this.favorites = data.favorites
    this.established = Producer.parseDate(data.established, true)
    this.about = data.about
    this.count = data.count
  }

  public readonly title: ContentTitle
  public readonly titles: TitleArray
  public readonly image: ImageFormatCollection
  public readonly favorites: number
  public readonly established: Date | null
  public readonly about: string | null
  public readonly count: number

  public async getFull () {
    return <Promise<ProducerFull>> this.client.producers.getFull(this.id)
  }

  public async getExternal () {
    return <Promise<Array<Link>>> this.client.producers.getExternal(this.id)
  }
}

export class ProducerFull extends Producer {
  public constructor (client: Client, data: any) {
    super(client, data)

    this.external = data.external?.map((entry: any) => Object.assign(entry, { url: new URL(entry.url) })) || []
  }

  public readonly external: Array<Link>
}
