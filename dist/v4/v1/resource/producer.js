"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProducerFull = exports.Producer = void 0;
const base_1 = require("./base");
const base_2 = require("./content/base");
class Producer extends base_1.BaseResource {
    constructor(client, data) {
        super(client, data);
        this.title = new base_2.ContentTitle(client, data.titles);
        this.titles = data.titles;
        this.image = new base_2.ContentImage(client, data.images);
        this.favorites = data.favorites;
        this.established = Producer.parseDate(data.established, true);
        this.about = data.about;
        this.count = data.count;
    }
    getFull() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.producers.getFull(this.id);
        });
    }
    getExternal() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.producers.getExternal(this.id);
        });
    }
}
exports.Producer = Producer;
class ProducerFull extends Producer {
    constructor(client, data) {
        var _a;
        super(client, data);
        this.external = ((_a = data.external) === null || _a === void 0 ? void 0 : _a.map((entry) => Object.assign(entry, { url: new URL(entry.url) }))) || [];
    }
}
exports.ProducerFull = ProducerFull;
