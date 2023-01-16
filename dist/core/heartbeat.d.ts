import { BaseClass } from '../resource/base';
import { Client } from '../core/client';
import { APIClient } from '../core/api';
export declare type HeartBeatStatus = 'Healthy' | 'Learning' | 'Unhealthy';
export declare class HeartBeat extends BaseClass {
    static parseStatus(data: any): HeartBeatStatus;
    readonly status: HeartBeatStatus;
    readonly score: number;
    readonly down: boolean;
    readonly lastDowntime: Date | null;
    constructor(client: Client, data: any);
}
export declare class HeartBeatMonitor extends BaseClass {
    protected APIClient: APIClient;
    check(): Promise<HeartBeat | undefined>;
    constructor(client: Client);
}
