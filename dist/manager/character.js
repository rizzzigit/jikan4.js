"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterManager = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../manager/base");
const character_1 = require("../resource/character");
const misc_1 = require("../resource/misc");
const utils_1 = require("../utils");
class CharacterManager extends base_1.BaseManager {
    // eslint-disable-next-line tsdoc/syntax
    /** @hidden */
    storeCache(data) {
        return super.storeCache(`characters/${data.mal_id}`, data);
    }
    search(searchString, filter, offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('characters', offset, maxCount, Object.assign({ disableCaching: true, [searchString.length === 1 ? 'letter' : 'q']: searchString }, filter && (0, utils_1.translateObject)(filter, (key, value) => {
                switch (key) {
                    case 'orderBy': return ['order_by', value];
                    default: return [key, `${value}`];
                }
            })));
            return rawData.map((character) => new character_1.Character(this.client, this.storeCache(character)));
        });
    }
    list(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('characters', offset, maxCount);
            return rawData.map((character) => new character_1.Character(this.client, this.storeCache(character)));
        });
    }
    listTop(offset, maxCount) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestPaginatedResource('top/characters', offset, maxCount);
            return rawData.map((character) => new character_1.Character(this.client, this.storeCache(character)));
        });
    }
    random() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource('random/characters', { disableCaching: 'true' });
            this.storeCache(rawData);
            return new character_1.Character(this.client, rawData);
        });
    }
    get(characterId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`characters/${characterId}`);
            return rawData ? new character_1.Character(this.client, rawData) : undefined;
        });
    }
    getAnime(characterId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`characters/${characterId}/anime`);
            return rawData ? rawData.map((animeReference) => new character_1.CharacterAnimeReference(this.client, characterId, animeReference)) : undefined;
        });
    }
    getManga(characterId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`characters/${characterId}/manga`);
            return rawData ? rawData.map((mangaReference) => new character_1.CharacterMangaReference(this.client, characterId, mangaReference)) : undefined;
        });
    }
    getVoiceActors(characterId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`characters/${characterId}/voices`);
            return rawData ? rawData.map((voiceActorReference) => new character_1.CharacterVoiceActorReference(this.client, characterId, voiceActorReference)) : undefined;
        });
    }
    getPictures(characterId) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const rawData = yield this.requestResource(`characters/${characterId}/pictures`);
            return rawData ? rawData.map((picture) => new misc_1.Image(this.client, picture)) : undefined;
        });
    }
}
exports.CharacterManager = CharacterManager;
