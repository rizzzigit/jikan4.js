import { MagazineMeta } from '../resource/meta';
import { BaseManager } from './base';
export declare class MagazineManager extends BaseManager {
    list(offset?: number, maxCount?: number): Promise<MagazineMeta[]>;
}
