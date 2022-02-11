/// <reference types="node" />
import { Client } from '../core/client';
import { BaseClass, BaseResource } from './base';
import { URL } from 'url';
export declare type ClubCategory = 'ActorsAndArtists' | 'Anime' | 'Characters' | 'CitiesAndNeighborhoods' | 'Companies' | 'Conventions' | 'Games' | 'Japan' | 'Manga' | 'Music' | 'Others' | 'Schools' | 'None' | 'Unknown';
export declare type ClubType = 'Public' | 'Private' | 'Secret' | 'Unknown';
export declare class Club extends BaseResource {
    /** @hidden */
    static parseCategory(input: any): ClubCategory;
    /** @hidden */
    static parseType(input: any): ClubType;
    readonly imageURL: URL | null;
    readonly memberCount: number;
    readonly pictureCount: number;
    readonly category: ClubCategory;
    readonly created: Date;
    readonly type: ClubType;
    readonly staff: Array<ClubStaff>;
    getMembers(): Promise<ClubMember[]>;
    constructor(client: Client, data: any);
}
export declare class ClubStaff extends BaseClass {
    readonly clubID: number;
    readonly URL: URL;
    readonly username: string;
    getClub(): Promise<Club>;
    constructor(client: Client, clubID: number, data: any);
}
export declare class ClubMember extends BaseClass {
    readonly clubID: number;
    readonly URL: URL;
    readonly username: string;
    readonly imageURL: URL | null;
    getClub(): Promise<Club>;
    constructor(client: Client, clubID: number, data: any);
}
