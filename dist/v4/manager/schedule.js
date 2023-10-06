"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleManager = void 0;
const anime_1 = require("../resource/content/anime");
const utils_1 = require("../utils");
const base_1 = require("./base");
class ScheduleManager extends base_1.BaseManager {
    list(arg0, arg1, arg2, arg3) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    case 'unapproved':
                        return value && [key, 'true'];
                }
            })));
            return rawData.map((data) => new anime_1.Anime(this.client, data));
        });
    }
}
exports.ScheduleManager = ScheduleManager;
