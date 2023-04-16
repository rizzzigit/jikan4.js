export declare function sleep(time: number): Promise<unknown>;
export declare function waitUntil(time: number): Promise<void>;
export declare function translateObject<T>(obj: T, translator: <K extends keyof T = keyof T>(key: K, value: T[K]) => ([string, any] | undefined)): {
    [key: string]: any;
};
