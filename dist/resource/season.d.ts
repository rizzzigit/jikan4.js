import { Client } from '../core/client';
import { BaseClass } from './base';
export declare type SeasonType = 'Winter' | 'Spring' | 'Summer' | 'Fall';
export declare class Season extends BaseClass {
    /** @hidden */
    private static parseSeasonType;
    readonly year: number;
    readonly seasons: Array<SeasonType>;
    constructor(client: Client, rawData: any);
}
