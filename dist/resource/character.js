"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterVoiceActorReference = exports.CharacterMangaReference = exports.CharacterAnimeReference = exports.Character = void 0;
const base_1 = require("./base");
const base_2 = require("./content/base");
const meta_1 = require("./meta");
class Character extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.image = new base_2.ContentImage(client, data.images);
        this.name = data.name;
        this.nameKanji = data.name_kanji || null;
        this.nicknames = data.nicknames.map((nickname) => nickname || null).filter((nickname) => !!nickname);
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
}
exports.Character = Character;
class CharacterAnimeReference extends base_1.BaseClass {
    constructor(client, characterId, data) {
        super(client);
        this.characterId = characterId;
        this.role = data.role;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
    }
    getCharacter() {
        return this.client.characters.get(this.characterId);
    }
}
exports.CharacterAnimeReference = CharacterAnimeReference;
class CharacterMangaReference extends base_1.BaseClass {
    constructor(client, characterId, data) {
        super(client);
        this.characterId = characterId;
        this.role = data.role;
        this.manga = new meta_1.MangaMeta(client, data);
    }
    getCharacter() {
        return this.client.characters.get(this.characterId);
    }
}
exports.CharacterMangaReference = CharacterMangaReference;
class CharacterVoiceActorReference extends base_1.BaseClass {
    constructor(client, characterId, data) {
        super(client);
        this.characterId = characterId;
        this.language = data.language;
        this.person = new meta_1.PersonMeta(client, data.person);
    }
    getCharacter() {
        return this.client.characters.get(this.characterId);
    }
}
exports.CharacterVoiceActorReference = CharacterVoiceActorReference;
