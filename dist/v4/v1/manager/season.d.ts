import { Anime } from '../resource/content/anime';
import { Season, SeasonType } from '../resource/season';
import { BaseManager } from './base';
export declare class SeasonManager extends BaseManager {
    list(offset?: number, maxCount?: number): Promise<Season[]>;
    getUpcoming(offset?: number, maxCount?: number): Promise<Anime[]>;
    get(season: SeasonType, year?: number, offset?: number, maxCount?: number): Promise<Anime[]>;
    getNow(offset?: number, maxCount?: number): Promise<Anime[]>;
}
