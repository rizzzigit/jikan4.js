"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonManager = void 0;
const tslib_1 = require("tslib");
const misc_1 = require("../resource/misc");
const person_1 = require("../resource/person");
const base_1 = require("../manager/base");
const utils_1 = require("../utils");
class PersonManager extends base_1.BaseManager {
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(data) {
        return super.storeCache(`people/${data.mal_id}`, data);
    }
    search(searchString, filter, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('people', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'orderBy': return ['order_by', value];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((data) => this.storeCache(data)).map((person) => new person_1.Person(this.client, person));
        });
    }
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('people', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((person) => new person_1.Person(this.client, person));
        });
    }
    listTop(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('top/people', offset, maxCount);
            return rawData.map((data) => this.storeCache(data)).map((person) => new person_1.Person(this.client, person));
        });
    }
    random() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource('random/people', { disableCaching: 'true' });
            this.storeCache(rawData);
            return new person_1.Person(this.client, rawData);
        });
    }
    get(personID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`people/${personID}`);
            return rawData ? new person_1.Person(this.client, rawData) : undefined;
        });
    }
    getAnime(personID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`people/${personID}/anime`);
            return rawData ? rawData.map((animeReference) => new person_1.PersonAnimeReference(this.client, personID, animeReference)) : undefined;
        });
    }
    getVoiceActors(personID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`people/${personID}/voices`);
            return rawData ? rawData.map((voiceActorReference) => new person_1.PersonVoiceActorReference(this.client, personID, voiceActorReference)) : undefined;
        });
    }
    getManga(personID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`people/${personID}/manga`);
            return rawData ? rawData.map((mangaReference) => new person_1.PersonMangaReference(this.client, personID, mangaReference)) : undefined;
        });
    }
    getPictures(personID) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`people/${personID}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
}
exports.PersonManager = PersonManager;
