import { RecommendationAnime, RecommendationManga } from "../resource/recommendation";
import { BaseManager } from "./base";

export class RecommendationManager extends BaseManager {
  public async getAnimeRecommendations(offset: number = 0, maxCount: number = 100) {
    const rawData = await this.requestPaginated(`recommendations/anime`, offset, maxCount)

    return rawData ? rawData.map((recommendation: any) => new RecommendationAnime(this.client, recommendation)) : undefined
  }

  public async getMangaRecommendations(offset: number = 0, maxCount: number = 100) {
    const rawData = await this.requestPaginated(`recommendations/manga`, offset, maxCount)

    return rawData ? rawData.map((recommendation: any) => new RecommendationManga(this.client, recommendation)) : undefined
  }
}
