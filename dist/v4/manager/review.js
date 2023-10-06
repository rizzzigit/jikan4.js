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
exports.ReviewManager = void 0;
const review_1 = require("../resource/review");
const utils_1 = require("../utils");
const base_1 = require("./base");
class ReviewManager extends base_1.BaseManager {
    getAnimeReviews(filter, offset = 0, maxCount = 50) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`reviews/anime`, offset, maxCount, (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'spoiler':
                    case 'preliminary': return value ? [key, 'true'] : undefined;
                }
            }));
            return (_a = rawData === null || rawData === void 0 ? void 0 : rawData.map((entry) => new review_1.ReviewAnime(this.client, entry))) !== null && _a !== void 0 ? _a : [];
        });
    }
    getMangaReviews(filter, offset = 0, maxCount = 50) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`reviews/manga`, offset, maxCount, (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'spoiler':
                    case 'preliminary': return value ? [key, 'true'] : undefined;
                }
            }));
            return (_a = rawData === null || rawData === void 0 ? void 0 : rawData.map((entry) => new review_1.ReviewManga(this.client, entry))) !== null && _a !== void 0 ? _a : [];
        });
    }
}
exports.ReviewManager = ReviewManager;
