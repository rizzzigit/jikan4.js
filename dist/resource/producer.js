"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerFull = exports.Producer = void 0;
const tslib_1 = require("tslib");
const url_1 = require("url");
const base_1 = require("./base");
const base_2 = require("./content/base");
class Producer extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.title = new base_2.ContentTitle(client, data.titles);
        this.titles = data.titles;
        this.image = new base_2.ContentImage(client, data.images);
        this.favorites = data.favorites;
        this.about = data.about;
        this.count = data.count;
    }
    getFull() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.client.producers.getFull(this.id);
        });
    }
    getExternal() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.client.producers.getExternal(this.id);
        });
    }
}
exports.Producer = Producer;
class ProducerFull extends Producer {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.external = ((_a = data.external) === null || _a === void 0 ? void 0 : _a.map((entry) => Object.assign(entry, { url: new url_1.URL(entry.url) }))) || [];
    }
}
exports.ProducerFull = ProducerFull;
