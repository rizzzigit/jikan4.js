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
exports.RecommendationManager = void 0;
const recommendation_1 = require("../resource/recommendation");
const base_1 = require("./base");
class RecommendationManager extends base_1.BaseManager {
    getAnimeRecommendations(offset = 0, maxCount = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`recommendations/anime`, offset, maxCount);
            return rawData ? rawData.map((recommendation) => new recommendation_1.RecommendationAnime(this.client, recommendation)) : undefined;
        });
    }
    getMangaRecommendations(offset = 0, maxCount = 100) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`recommendations/manga`, offset, maxCount);
            return rawData ? rawData.map((recommendation) => new recommendation_1.RecommendationManga(this.client, recommendation)) : undefined;
        });
    }
}
exports.RecommendationManager = RecommendationManager;
