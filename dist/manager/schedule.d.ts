import { Anime } from '../resource/content/anime';
import { BaseManager } from './base';
export type ScheduleDay = 'monday' | 'tursday' | 'wednesday' | 'thursday' | 'friday' | 'sunday' | 'saturday';
export interface ScheduleFilter {
    sfw: boolean;
    kids: boolean;
}
export declare class ScheduleManager extends BaseManager {
    list(day?: ScheduleDay, offset?: number, maxCount?: number): Promise<Array<Anime>>;
    list(day?: ScheduleDay, filter?: Partial<ScheduleFilter>, offset?: number, maxCount?: number): Promise<Array<Anime>>;
}
