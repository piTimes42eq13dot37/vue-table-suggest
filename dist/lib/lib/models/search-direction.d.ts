import { DateRelation } from './date-relation';
export type SearchDirection = `${DateRelation}`;
export declare const isSearchDirectionBefore: (value: unknown) => value is import("./date-relation").DateRelationValue;
export declare const isSearchDirectionAfter: (value: unknown) => value is import("./date-relation").DateRelationValue;
export declare const isSearchDirectionOn: (value: unknown) => value is import("./date-relation").DateRelationValue;
export declare const isSearchDirection: (value: unknown) => value is import("./date-relation").DateRelationValue;
