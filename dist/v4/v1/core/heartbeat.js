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
exports.HeartBeatMonitor = exports.HeartBeat = void 0;
const base_1 = require("../resource/base");
class HeartBeat extends base_1.BaseClass {
    static parseStatus(data) {
        switch ((data === null || data === void 0 ? void 0 : data.toLowerCase().trim()) || '') {
            case 'healthy': return 'Healthy';
            case 'learning': return 'Learning';
            case 'unhealthy': return 'Unhealthy';
            default: throw new Error(`Unknown status: ${data}`);
        }
    }
    constructor(client, data) {
        super(client);
        this.status = HeartBeat.parseStatus(data.status);
        this.score = data.score;
        this.down = !!data.down;
        this.lastDowntime = data.last_downtime ? new Date(data.last_downtime) : null;
    }
}
exports.HeartBeat = HeartBeat;
class HeartBeatMonitor extends base_1.BaseClass {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            const { APIClient, client } = this;
            const responseData = yield APIClient.request({
                cache: false,
                path: ''
            });
            if (responseData.status === 200) {
                const { body: { myanimelist_heartbeat: heartBeat } } = responseData;
                return new HeartBeat(client, heartBeat);
            }
        });
    }
    constructor(client) {
        super(client);
        this.APIClient = client.APIClient;
    }
}
exports.HeartBeatMonitor = HeartBeatMonitor;
