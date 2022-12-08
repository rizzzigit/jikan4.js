"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../manager/base");
const club_1 = require("../resource/club");
const utils_1 = require("../utils");
class ClubManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated(`clubs/${clubId}/members`);
            return rawData ? rawData.map((member) => club_1.Club.parseMember(member)) : undefined;
        });
    }
}
exports.ClubManager = ClubManager;
