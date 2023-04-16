import { MangaReview } from './content/manga'
import { AnimeReview } from './content/anime'
import { Client } from '../core/client'
import { AnimeMeta, MangaMeta } from './meta'

export class TopAnimeReview extends AnimeReview {
  public readonly anime: AnimeMeta

  public constructor (client: Client, data: any) {
    super(client, data)

    this.anime = new AnimeMeta(this.client, data.entry)
  }
}

export class TopMangaReview extends MangaReview {
  public readonly manga: MangaMeta

  public constructor (client: Client, data: any) {
    super(client, data)

    this.manga = new MangaMeta(this.client, data.entry)
  }
}
