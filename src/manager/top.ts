import { Anime, Manga } from '../Jikan'
import { TopAnimeFilter } from './anime'
import { BaseManager } from './base'
import { TopMangaFilter } from './manga'

export class TopManager extends BaseManager {
  public listAnime (filter?: Partial<TopAnimeFilter>, offset?: number, maxCount?: number) {
    return this.client.anime.listTop(filter, offset, maxCount)
  }

  public listManga (filter?: Partial<TopMangaFilter>, offset?: number, maxCount?: number) {
    return this.client.manga.listTop(filter, offset, maxCount)
  }

  public listPeople (offset?: number, maxCount?: number) {
    return this.client.people.listTop(offset, maxCount)
  }

  public listCharacters (offset?: number, maxCount?: number) {
    return this.client.characters.listTop(offset, maxCount)
  }

  public async listReviews (offset: number = 0, maxCount: number = this.client.options.dataPaginationMaxSize) {
    const rawData = <Array<any>> await this.requestPaginated('top/reviews', offset, maxCount)

    return rawData.map((data: any) => {
      switch (data.type) {
        case 'anime': return Anime.parseTopReview(this.client, data)
        case 'manga': return Manga.parseTopReview(this.client, data)

        default:
          throw new Error(`Unknown review type: ${data.type}`)
      }
    })
  }
}
