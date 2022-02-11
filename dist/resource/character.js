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
        this.name = Character.parseString(data.name);
        this.nicknames = data.nicknames.map((nickname) => Character.parseString(nickname, true)).filter((nickname) => !!nickname);
        this.favorites = Character.parseNumber(data.favorites);
        this.about = Character.parseString(data.about, true);
    }
    getAnime() {
        return this.client.characters.getAnime(this.ID);
    }
    getManga() {
        return this.client.characters.getManga(this.ID);
    }
    getVoiceActors() {
        return this.client.characters.getVoiceActors(this.ID);
    }
    getPictures() {
        return this.client.characters.getPictures(this.ID);
    }
}
exports.Character = Character;
class CharacterAnimeReference extends base_1.BaseClass {
    constructor(client, characterID, data) {
        super(client);
        this.characterID = characterID;
        this.role = CharacterAnimeReference.parseString(data.role);
        this.anime = new meta_1.AnimeMeta(client, data.anime);
    }
    getCharacter() {
        return this.client.characters.get(this.characterID);
    }
}
exports.CharacterAnimeReference = CharacterAnimeReference;
class CharacterMangaReference extends base_1.BaseClass {
    constructor(client, characterID, data) {
        super(client);
        this.characterID = characterID;
        this.role = CharacterMangaReference.parseString(data.role);
        this.manga = new meta_1.MangaMeta(client, data);
    }
    getCharacter() {
        return this.client.characters.get(this.characterID);
    }
}
exports.CharacterMangaReference = CharacterMangaReference;
class CharacterVoiceActorReference extends base_1.BaseClass {
    constructor(client, characterID, data) {
        super(client);
        this.characterID = characterID;
        this.language = CharacterVoiceActorReference.parseString(data.language);
        this.person = new meta_1.PersonMeta(client, data.person);
    }
    getCharacter() {
        return this.client.characters.get(this.characterID);
    }
}
exports.CharacterVoiceActorReference = CharacterVoiceActorReference;
