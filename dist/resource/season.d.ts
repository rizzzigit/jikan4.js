import { Client } from '../core/client';
import { BaseClass } from './base';
export declare type SeasonType = 'Winter' | 'Spring' | 'Summer' | 'Fall' | 'Unknown';
export declare class Season extends BaseClass {
    /** @hidden */
    static parseSeasonType(input: any): SeasonType;
    readonly year: number;
    readonly seasons: Array<SeasonType>;
    constructor(client: Client, rawData: any);
}
