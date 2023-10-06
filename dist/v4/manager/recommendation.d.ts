import { RecommendationAnime, RecommendationManga } from "../resource/recommendation";
import { BaseManager } from "./base";
export declare class RecommendationManager extends BaseManager {
    getAnimeRecommendations(offset?: number, maxCount?: number): Promise<RecommendationAnime[] | undefined>;
    getMangaRecommendations(offset?: number, maxCount?: number): Promise<RecommendationManga[] | undefined>;
}
