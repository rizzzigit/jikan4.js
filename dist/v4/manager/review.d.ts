import { ReviewAnime, ReviewManga } from "../resource/review";
import { BaseManager } from "./base";
export interface ReviewSearchFilter {
    preliminary: boolean;
    spoiler: boolean;
}
export declare class ReviewManager extends BaseManager {
    getAnimeReviews(filter?: Partial<ReviewSearchFilter>, offset?: number, maxCount?: number): Promise<Array<ReviewAnime>>;
    getMangaReviews(filter?: Partial<ReviewSearchFilter>, offset?: number, maxCount?: number): Promise<Array<ReviewManga>>;
}
