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
exports.SeasonManager = void 0;
const anime_1 = require("../resource/content/anime");
const season_1 = require("../resource/season");
const base_1 = require("./base");
class SeasonManager extends base_1.BaseManager {
    list(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('seasons', offset, maxCount);
            return rawData.map((data) => new season_1.Season(this.client, data));
        });
    }
    getUpcoming(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('seasons/upcoming', offset, maxCount);
            return rawData.map((data) => new anime_1.Anime(this.client, data));
        });
    }
    get(season, year = new Date().getFullYear(), offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`seasons/${year}/${season.toLowerCase()}`, offset, maxCount);
            return rawData.map((data) => new anime_1.Anime(this.client, data));
        });
    }
    getNow(offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('seasons/now', offset, maxCount);
            return rawData.map((data) => new anime_1.Anime(this.client, data));
        });
    }
}
exports.SeasonManager = SeasonManager;
