"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterFull = exports.CharacterVoiceActorReference = exports.CharacterMangaReference = exports.CharacterAnimeReference = exports.Character = void 0;
const base_1 = require("./base");
const base_2 = require("./content/base");
const meta_1 = require("./meta");
class Character extends base_1.BaseResource {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.image = new base_2.ContentImage(client, data.images);
        this.name = data.name;
        this.nameKanji = data.name_kanji || null;
        this.nicknames = ((_a = data.nicknames) === null || _a === void 0 ? void 0 : _a.map((nickname) => nickname || null).filter((nickname) => !!nickname)) || [];
        this.favorites = data.favorites;
        this.about = data.about || null;
    }
    getAnime() {
        return this.client.characters.getAnime(this.id);
    }
    getManga() {
        return this.client.characters.getManga(this.id);
    }
    getVoiceActors() {
        return this.client.characters.getVoiceActors(this.id);
    }
    getPictures() {
        return this.client.characters.getPictures(this.id);
    }
    getFull() {
        return this.client.characters.getFull(this.id);
    }
}
exports.Character = Character;
class CharacterAnimeReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.role = data.role;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
    }
}
exports.CharacterAnimeReference = CharacterAnimeReference;
class CharacterMangaReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.role = data.role;
        this.manga = new meta_1.MangaMeta(client, data.manga);
    }
}
exports.CharacterMangaReference = CharacterMangaReference;
class CharacterVoiceActorReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.language = data.language;
        this.person = new meta_1.PersonMeta(client, data.person);
    }
}
exports.CharacterVoiceActorReference = CharacterVoiceActorReference;
class CharacterFull extends Character {
    constructor(client, data) {
        var _a, _b, _c;
        super(client, data);
        this.anime = (_a = data.anime) === null || _a === void 0 ? void 0 : _a.map((anime) => new CharacterAnimeReference(client, anime));
        this.manga = (_b = data.manga) === null || _b === void 0 ? void 0 : _b.map((manga) => new CharacterMangaReference(client, manga));
        this.voices = (_c = data.voices) === null || _c === void 0 ? void 0 : _c.map((voice) => new CharacterVoiceActorReference(client, voice));
    }
}
exports.CharacterFull = CharacterFull;
