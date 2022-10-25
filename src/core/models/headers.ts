export type ReqHeaders = Record<string, string>;

export type DtoWithDateHeader<T> = T & { date: string };
