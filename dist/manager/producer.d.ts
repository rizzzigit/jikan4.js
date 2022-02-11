import { ProducerMeta } from '../resource/meta';
import { BaseManager } from './base';
export declare class ProducerManager extends BaseManager {
    list(offset?: number, maxCount?: number): Promise<ProducerMeta[]>;
}
