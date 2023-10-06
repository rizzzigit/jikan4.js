import { ReviewAnime, ReviewManga } from "../resource/review";
import { translateObject } from "../utils";
import { BaseManager } from "./base";

export interface ReviewSearchFilter {
  preliminary: boolean
  spoiler: boolean
}

export class ReviewManager extends BaseManager {
  public async getAnimeReviews (filter?: Partial<ReviewSearchFilter>, offset: number = 0, maxCount: number = 50): Promise<Array<ReviewAnime>> {
    const rawData = await this.requestPaginated(`reviews/anime`, offset, maxCount, translateObject(filter, (key, value) => {
      switch (key) {
        case 'spoiler':
        case 'preliminary': return value ? [key, 'true'] : undefined
      }
    }))

    return rawData?.map((entry) => new ReviewAnime(this.client, entry)) ?? []
  }
  public async getMangaReviews (filter?: Partial<ReviewSearchFilter>, offset: number = 0, maxCount: number = 50): Promise<Array<ReviewManga>> {
    const rawData = await this.requestPaginated(`reviews/manga`, offset, maxCount, translateObject(filter, (key, value) => {
      switch (key) {
        case 'spoiler':
        case 'preliminary': return value ? [key, 'true'] : undefined
      }
    }))

    return rawData?.map((entry) => new ReviewManga(this.client, entry)) ?? []
  }
}
