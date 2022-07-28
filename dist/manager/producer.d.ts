import { Producer, ProducerFull } from '../resource/producer';
import { BaseManager } from './base';
export declare class ProducerManager extends BaseManager {
    list(offset?: number, maxCount?: number): Promise<Producer[]>;
    get(producerId: number): Promise<Producer | undefined>;
    getFull(producerId: number): Promise<ProducerFull | undefined>;
    getExternal(producerId: number): Promise<any>;
}
