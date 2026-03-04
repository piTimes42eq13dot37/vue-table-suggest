import type { DateReference } from './date-reference';
import type { DateRelation } from './date-relation';
declare const builtInSearchTokenType: {
    readonly fulltext: "fulltext";
    readonly scope: "scope";
    readonly dateBefore: "date_before";
    readonly dateAfter: "date_after";
    readonly dateExact: "date_exact";
    readonly dateRelative: "date_relative";
};
declare const dateOperationTypes: readonly ["date_before", "date_after", "date_exact"];
export type BuiltInSearchTokenType = (typeof builtInSearchTokenType)[keyof typeof builtInSearchTokenType];
export type SearchTokenType = BuiltInSearchTokenType | string;
export type DateOperationTokenType = (typeof dateOperationTypes)[number];
interface TokenBase {
    uid: string;
    title: string;
}
export interface DateOperationToken extends TokenBase {
    type: DateOperationTokenType;
    rawTitle: string;
}
export interface DateRelativeToken extends TokenBase {
    type: typeof builtInSearchTokenType.dateRelative;
    rawTitle: string;
    dateRelation: DateRelation;
    reference: DateReference;
}
export interface FulltextToken extends TokenBase {
    type: typeof builtInSearchTokenType.fulltext;
}
export interface FulltextColumnScopeToken extends TokenBase {
    type: typeof builtInSearchTokenType.scope;
    key: string;
    matchCount?: number;
    icon?: string;
}
export interface ExactCellValueToken extends TokenBase {
    type: Exclude<SearchTokenType, BuiltInSearchTokenType>;
    key?: string;
    icon?: string;
}
export type DateSearchToken = DateOperationToken | DateRelativeToken;
export type SearchToken = DateOperationToken | DateRelativeToken | FulltextToken | FulltextColumnScopeToken | ExactCellValueToken;
type BuiltInToken = DateSearchToken | FulltextToken | FulltextColumnScopeToken;
export declare const SearchTokenModel: {
    fulltext: "fulltext";
    scope: "scope";
    dateBefore: "date_before";
    dateAfter: "date_after";
    dateExact: "date_exact";
    dateRelative: "date_relative";
    dateOperationTypes: readonly ["date_before", "date_after", "date_exact"];
    isFulltextType: (value: string) => value is typeof builtInSearchTokenType.fulltext;
    isScopeType: (value: string) => value is typeof builtInSearchTokenType.scope;
    isDateBeforeType: (value: string) => value is typeof builtInSearchTokenType.dateBefore;
    isDateAfterType: (value: string) => value is typeof builtInSearchTokenType.dateAfter;
    isDateExactType: (value: string) => value is typeof builtInSearchTokenType.dateExact;
    isDateRelativeType: (value: string) => value is typeof builtInSearchTokenType.dateRelative;
    isDateType: (value: string) => value is Exclude<BuiltInSearchTokenType, "fulltext" | "scope">;
    isBuiltInType: (value: string) => value is BuiltInSearchTokenType;
    isExactCellValueType: (value: string) => boolean;
    isFulltext: (token: SearchToken) => token is FulltextToken;
    isScope: (token: SearchToken) => token is FulltextColumnScopeToken;
    isDateBefore: (token: SearchToken) => token is DateOperationToken;
    isDateAfter: (token: SearchToken) => token is DateOperationToken;
    isDateExact: (token: SearchToken) => token is DateOperationToken;
    isDateRelative: (token: SearchToken) => token is DateRelativeToken;
    isDate: (token: SearchToken) => token is DateSearchToken;
    isBuiltIn: (token: SearchToken) => token is BuiltInToken;
    isExactCellValue: (token: SearchToken) => token is ExactCellValueToken;
    isBeforeDirection: (token: SearchToken) => boolean;
    isAfterDirection: (token: SearchToken) => boolean;
    isOnDirection: (token: SearchToken) => boolean;
    resolveTermKey: (token: SearchToken) => string;
};
interface TokenCategoryResolverOptions {
    getColumnByKey?: (key: string) => {
        label: string;
    } | undefined;
    suggestionCategoryLabelByType?: Record<string, string>;
}
export declare const resolveTokenIcon: (token: SearchToken) => string | undefined;
export declare const resolveTokenCategory: (token: SearchToken, options?: TokenCategoryResolverOptions) => string;
export {};
