export type MaybeArray<T> = T | T[];

export type MaybePromise<T> = T | Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export type UnknownObj = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructable<T> = new (...args: any[]) => T;

export type AssertExtendedType<T, T1> = T extends T1 ? T1 : T & T1;
