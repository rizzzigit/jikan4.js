"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleManager = void 0;
const tslib_1 = require("tslib");
const anime_1 = require("../resource/content/anime");
const utils_1 = require("../utils");
const base_1 = require("./base");
class ScheduleManager extends base_1.BaseManager {
    list(arg0, arg1, arg2, arg3) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { day, filter, offset, maxCount } = (() => {
                const day = arg0;
                let filter;
                let offset;
                let maxCount;
                if (typeof (arg1) === 'number') {
                    offset = arg1;
                    maxCount = arg2;
                }
                else {
                    filter = arg1;
                    offset = arg2;
                    maxCount = arg3;
                }
                return { day, filter, offset, maxCount };
            })();
            const rawData = yield this.requestPaginated(`schedules${day ? `/${day}` : ''}`, offset, maxCount, Object.assign({}, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'kids':
                    case 'sfw':
                        return value && [key, 'true'];
                }
            })));
            return rawData.map((data) => new anime_1.Anime(this.client, this.client.anime.storeCache(data)));
        });
    }
}
exports.ScheduleManager = ScheduleManager;
