"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Season = void 0;
const base_1 = require("./base");
class Season extends base_1.BaseClass {
    constructor(client, rawData) {
        super(client);
        this.year = Season.parseNumber(rawData.year);
        this.seasons = rawData.seasons.map((season) => Season.parseSeasonType(season));
    }
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    static parseSeasonType(input) {
        switch (`${input}`.trim()) {
            case 'winter': return 'Winter';
            case 'spring': return 'Spring';
            case 'summer': return 'Summer';
            case 'fall': return 'Fall';
            default:
                throw new Error(`Unknown season type: ${input}`);
        }
    }
}
exports.Season = Season;
