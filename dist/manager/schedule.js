"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleManager = void 0;
const tslib_1 = require("tslib");
const anime_1 = require("../resource/content/anime");
const base_1 = require("./base");
class ScheduleManager extends base_1.BaseManager {
    list(day, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`schedules${day ? `/${day}` : ''}`, offset, maxCount, { disableCaching: 'true' });
            return rawData.map((data) => new anime_1.Anime(this.client, this.client.anime.storeCache(data)));
        });
    }
}
exports.ScheduleManager = ScheduleManager;
