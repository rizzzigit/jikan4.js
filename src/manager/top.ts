import { TopAnimeReview, TopMangaReview } from '../resource/top'
import { BaseManager } from './base'

export class TopManager extends BaseManager {
  public listAnime (offset?: number, maxCount?: number) {
    return this.client.anime.listTop(offset, maxCount)
  }

  public listManga (offset?: number, maxCount?: number) {
    return this.client.manga.listTop(offset, maxCount)
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
        case 'anime': return new TopAnimeReview(this.client, data)
        case 'manga': return new TopMangaReview(this.client, data)

        default:
          throw new Error(`Unknown review type: ${data.type}`)
      }
    })
  }
}
