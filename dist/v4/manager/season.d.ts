import { Anime } from "../resource/content/anime";
import { Season, SeasonType } from "../resource/season";
import { BaseManager } from "./base";
export interface SeasonFilter {
    filter: "tv" | "movie" | "ova" | "special" | "ona" | "music";
    sfw: boolean;
    unapproved: boolean;
    continuing: boolean;
}
export declare class SeasonManager extends BaseManager {
    list(...args: [offset?: number, maxCount?: number] | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]): Promise<Season[]>;
    getUpcoming(offset?: number, maxCount?: number): Promise<Anime[]>;
    get(season: SeasonType, year?: number, ...args: [offset?: number, maxCount?: number] | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]): Promise<Anime[]>;
    getNow(...args: [offset?: number, maxCount?: number] | [filter: Partial<SeasonFilter>, offset?: number, maxCount?: number]): Promise<Anime[]>;
}
