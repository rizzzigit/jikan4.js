"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartBeatMonitor = exports.HeartBeat = void 0;
const tslib_1 = require("tslib");
const base_1 = require("../resource/base");
class HeartBeat extends base_1.BaseClass {
    constructor(client, data) {
        super(client);
        this.status = HeartBeat.parseStatus(data.status);
        this.score = data.score;
        this.down = !!data.down;
        this.lastDowntime = data.last_downtime ? new Date(data.last_downtime) : null;
    }
    static parseStatus(data) {
        switch ((data === null || data === void 0 ? void 0 : data.toLowerCase().trim()) || '') {
            case 'healthy': return 'Healthy';
            case 'learning': return 'Learning';
            case 'unhealthy': return 'Unhealthy';
            default: throw new Error(`Unknown status: ${data}`);
        }
    }
}
exports.HeartBeat = HeartBeat;
class HeartBeatMonitor extends base_1.BaseClass {
    constructor(client) {
        super(client);
        this.APIClient = client.APIClient;
    }
    check() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const { APIClient, client } = this;
            const responseData = yield APIClient.request({
                cache: false,
                path: '/'
            });
            if (responseData.status === 200) {
                const { body: { myanimelist_heartbeat: heartBeat } } = responseData;
                return new HeartBeat(client, heartBeat);
            }
        });
    }
}
exports.HeartBeatMonitor = HeartBeatMonitor;
