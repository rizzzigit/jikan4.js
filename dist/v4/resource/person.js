"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonFull = exports.PersonMangaReference = exports.PersonVoiceActorReference = exports.PersonAnimeReference = exports.Person = exports.PersonName = void 0;
const base_1 = require("./base");
const meta_1 = require("./meta");
const misc_1 = require("./misc");
class PersonName extends base_1.BaseClass {
    toString() {
        return this.name;
    }
    constructor(client, data) {
        var _a;
        super(client);
        this.name = data.name;
        this.given = data.given_name || null;
        this.family = data.faimly_name || null;
        this.alternate = ((_a = data.alternate_names) === null || _a === void 0 ? void 0 : _a.map((alternate) => alternate || null).filter((alternate) => !!alternate)) || [];
    }
}
exports.PersonName = PersonName;
class Person extends base_1.BaseResource {
    getAnime() {
        return this.client.people.getAnime(this.id);
    }
    getVoiceActors() {
        return this.client.people.getVoiceActors(this.id);
    }
    getManga() {
        return this.client.people.getManga(this.id);
    }
    getPictures() {
        return this.client.people.getPictures(this.id);
    }
    getFull() {
        return this.client.people.getFull(this.id);
    }
    constructor(client, data) {
        super(client, data);
        this.websiteUrl = Person.parseURL(data.website_url, true);
        this.image = data.images != null ? new misc_1.ImageFormatCollection(client, data.images) : null;
        this.name = new PersonName(client, data);
        this.birth = Person.parseDate(data.birthday, true);
        this.favorites = data.favorites;
        this.about = data.about || null;
    }
}
exports.Person = Person;
class PersonAnimeReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.position = data.position;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
    }
}
exports.PersonAnimeReference = PersonAnimeReference;
class PersonVoiceActorReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.role = data.role;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
        this.character = new meta_1.CharacterMeta(client, data.character);
    }
}
exports.PersonVoiceActorReference = PersonVoiceActorReference;
class PersonMangaReference extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.position = data.position;
        this.manga = new meta_1.MangaMeta(client, data.manga);
    }
}
exports.PersonMangaReference = PersonMangaReference;
class PersonFull extends Person {
    constructor(client, data) {
        var _a, _b, _c;
        super(client, data);
        this.anime = ((_a = data.anime) === null || _a === void 0 ? void 0 : _a.map((anime) => new PersonAnimeReference(client, anime))) || [];
        this.manga = ((_b = data.manga) === null || _b === void 0 ? void 0 : _b.map((manga) => new PersonMangaReference(client, manga))) || [];
        this.voices = ((_c = data.voices) === null || _c === void 0 ? void 0 : _c.map((voice) => new PersonVoiceActorReference(client, voice))) || [];
    }
}
exports.PersonFull = PersonFull;
