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
exports.TopManager = void 0;
const top_1 = require("../resource/top");
const base_1 = require("./base");
class TopManager extends base_1.BaseManager {
    listAnime(filter, offset, maxCount) {
        return this.client.anime.listTop(filter, offset, maxCount);
    }
    listManga(filter, offset, maxCount) {
        return this.client.manga.listTop(filter, offset, maxCount);
    }
    listPeople(offset, maxCount) {
        return this.client.people.listTop(offset, maxCount);
    }
    listCharacters(offset, maxCount) {
        return this.client.characters.listTop(offset, maxCount);
    }
    listReviews(offset = 0, maxCount = this.client.options.dataPaginationMaxSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/reviews', offset, maxCount);
            return rawData.map((data) => {
                switch (data.type) {
                    case 'anime': return new top_1.TopAnimeReview(this.client, data);
                    case 'manga': return new top_1.TopMangaReview(this.client, data);
                    default:
                        throw new Error(`Unknown review type: ${data.type}`);
                }
            });
        });
    }
}
exports.TopManager = TopManager;
