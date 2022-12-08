"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterManager = void 0;
const tslib_1 = require("tslib");
const Jikan_1 = require("../Jikan");
const base_1 = require("../manager/base");
const character_1 = require("../resource/character");
const utils_1 = require("../utils");
class CharacterManager extends base_1.BaseManager {
    search(searchString, filter, offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('characters', offset, maxCount, Object.assign({ [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'orderBy': return ['order_by', value];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((character) => new character_1.Character(this.client, character));
        });
    }
    list(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('characters', offset, maxCount);
            return rawData.map((character) => new character_1.Character(this.client, character));
        });
    }
    listTop(offset, maxCount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginated('top/characters', offset, maxCount);
            return rawData.map((character) => new character_1.Character(this.client, character));
        });
    }
    random() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request('random/characters', { disableCaching: 'true' });
            return new character_1.Character(this.client, rawData);
        });
    }
    get(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}`);
            return rawData ? new character_1.Character(this.client, rawData) : undefined;
        });
    }
    getFull(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}/full`);
            return rawData ? new character_1.CharacterFull(this.client, rawData) : undefined;
        });
    }
    getAnime(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}/anime`);
            return rawData ? rawData.map((animeReference) => character_1.Character.parseAnimeReference(this.client, animeReference)) : undefined;
        });
    }
    getManga(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}/manga`);
            return rawData ? rawData.map((mangaReference) => character_1.Character.parseMangaReference(this.client, mangaReference)) : undefined;
        });
    }
    getVoiceActors(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}/voices`);
            return rawData ? rawData.map((voiceActorReference) => character_1.Character.parseVoiceActorReference(this.client, voiceActorReference)) : undefined;
        });
    }
    getPictures(characterId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rawData = yield this.request(`characters/${characterId}/pictures`);
            return rawData ? rawData.map((picture) => Jikan_1.BaseClass.parseImage(picture)) : undefined;
        });
    }
}
exports.CharacterManager = CharacterManager;
