import { AnimeRecommendation, MangaRecommendation } from "../resource/recommendation";
import { BaseManager } from "./base";
export declare class RecommendationManager extends BaseManager {
    getAnimeRecommendations(offset?: number, maxCount?: number): Promise<AnimeRecommendation[] | undefined>;
    getMangaRecommendations(offset?: number, maxCount?: number): Promise<MangaRecommendation[] | undefined>;
}
