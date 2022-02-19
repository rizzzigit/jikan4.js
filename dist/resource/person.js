"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonMangaReference = exports.PersonVoiceActorReference = exports.PersonAnimeReference = exports.Person = exports.PersonName = void 0;
const base_1 = require("./base");
const meta_1 = require("./meta");
const misc_1 = require("./misc");
class PersonName extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.name = data.name;
        this.given = data.given_name || null;
        this.family = data.faimly_name || null;
        this.alternate = data.alternate_names.map((alternate) => alternate || null).filter((alternate) => !!alternate);
    }
    toString() {
        return this.name;
    }
}
exports.PersonName = PersonName;
class Person extends base_1.BaseResource {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.websiteUrl = Person.parseURL(data.website_url, true);
        this.image = new misc_1.Image(client, (_a = data.images) === null || _a === void 0 ? void 0 : _a.jpg);
        this.name = new PersonName(client, data);
        this.birth = Person.parseDate(data.birthday, true);
        this.favorites = data.favorites;
        this.about = data.about || null;
    }
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
}
exports.Person = Person;
class PersonAnimeReference extends base_1.BaseClass {
    constructor(client, personId, data) {
        super(client);
        this.personId = personId;
        this.position = data.position;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
    }
    getPerson() {
        return this.client.people.get(this.personId);
    }
}
exports.PersonAnimeReference = PersonAnimeReference;
class PersonVoiceActorReference extends base_1.BaseClass {
    constructor(client, personId, data) {
        super(client);
        this.personId = personId;
        this.role = data.role;
        this.anime = new meta_1.AnimeMeta(client, data.anime);
        this.character = new meta_1.CharacterMeta(client, data.character);
    }
    getPerson() {
        return this.client.people.get(this.personId);
    }
}
exports.PersonVoiceActorReference = PersonVoiceActorReference;
class PersonMangaReference extends base_1.BaseClass {
    constructor(client, personId, data) {
        super(client);
        this.personId = personId;
        this.position = data.position;
        this.manga = new meta_1.MangaMeta(client, data.manga);
    }
    getPerson() {
        return this.client.people.get(this.personId);
    }
}
exports.PersonMangaReference = PersonMangaReference;
