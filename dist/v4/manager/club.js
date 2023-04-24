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
exports.ClubManager = void 0;
const base_1 = require("../manager/base");
const club_1 = require("../resource/club");
const utils_1 = require("../utils");
class ClubManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('clubs', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'orderBy': return ['order_by', value];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((club) => new club_1.Club(this.client, club));
        });
    }
    get(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`clubs/${clubId}`);
            if (rawData) {
                return new club_1.Club(this.client, rawData);
            }
            else {
                return rawData === null ? null : undefined;
            }
        });
    }
    getMembers(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`clubs/${clubId}/members`);
            return rawData ? rawData.map((member) => new club_1.ClubMember(this.client, member)) : undefined;
        });
    }
}
exports.ClubManager = ClubManager;
