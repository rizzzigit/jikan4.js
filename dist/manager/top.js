"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopManager = void 0;
const tslib_1 = require("tslib");
const Jikan_1 = require("../Jikan");
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/reviews', offset, maxCount);
            return rawData.map((data) => {
                switch (data.type) {
                    case 'anime': return Jikan_1.Anime.parseTopReview(this.client, data);
                    case 'manga': return Jikan_1.Manga.parseTopReview(this.client, data);
                    default:
                        throw new Error(`Unknown review type: ${data.type}`);
                }
            });
        });
    }
}
exports.TopManager = TopManager;
