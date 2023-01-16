"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Season = void 0;
const base_1 = require("./base");
class Season extends base_1.BaseClass {
    constructor(client, rawData) {
        var _a;
        super(client);
        this.year = rawData.year;
        this.seasons = ((_a = rawData.seasons) === null || _a === void 0 ? void 0 : _a.map((season) => Season.parseSeasonType(season))) || [];
    }
    /** @hidden */
    static parseSeasonType(input) {
        switch (`${input}`.trim()) {
            case 'winter': return 'Winter';
            case 'spring': return 'Spring';
            case 'summer': return 'Summer';
            case 'fall': return 'Fall';
            default: return 'Unknown';
        }
    }
}
exports.Season = Season;
