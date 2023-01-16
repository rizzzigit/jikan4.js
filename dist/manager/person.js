"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonManager = void 0;
const tslib_1 = require("tslib");
const misc_1 = require("../resource/misc");
const person_1 = require("../resource/person");
const base_1 = require("../manager/base");
const utils_1 = require("../utils");
class PersonManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('people', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'orderBy': return ['order_by', value];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((person) => new person_1.Person(this.client, person));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('people', offset, maxCount);
            return rawData.map((person) => new person_1.Person(this.client, person));
        });
    }
    listTop(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/people', offset, maxCount);
            return rawData.map((person) => new person_1.Person(this.client, person));
        });
    }
    random() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/people', { disableCaching: 'true' });
            return new person_1.Person(this.client, rawData);
        });
    }
    get(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}`);
            return rawData ? new person_1.Person(this.client, rawData) : undefined;
        });
    }
    getFull(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}/full`);
            return rawData ? new person_1.PersonFull(this.client, rawData) : undefined;
        });
    }
    getAnime(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}/anime`);
            return rawData ? rawData.map((animeReference) => new person_1.PersonAnimeReference(this.client, animeReference)) : undefined;
        });
    }
    getVoiceActors(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}/voices`);
            return rawData ? rawData.map((voiceActorReference) => new person_1.PersonVoiceActorReference(this.client, voiceActorReference)) : undefined;
        });
    }
    getManga(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}/manga`);
            return rawData ? rawData.map((mangaReference) => new person_1.PersonMangaReference(this.client, mangaReference)) : undefined;
        });
    }
    getPictures(personId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`people/${personId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
}
exports.PersonManager = PersonManager;
