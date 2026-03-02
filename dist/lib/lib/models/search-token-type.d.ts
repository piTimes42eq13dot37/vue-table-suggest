export type BuiltInSearchTokenType = 'fulltext' | 'scope' | 'date_before' | 'date_after' | 'date_exact' | 'date_relative';
export type SearchTokenType = BuiltInSearchTokenType | string;
export declare class SearchTokenTypeValueObject {
    static readonly fulltext: BuiltInSearchTokenType;
    static readonly scope: BuiltInSearchTokenType;
    static readonly dateBefore: BuiltInSearchTokenType;
    static readonly dateAfter: BuiltInSearchTokenType;
    static readonly dateExact: BuiltInSearchTokenType;
    static readonly dateRelative: BuiltInSearchTokenType;
    static isFulltext(value: unknown): boolean;
    static isScope(value: unknown): boolean;
    static isDateBefore(value: unknown): boolean;
    static isDateAfter(value: unknown): boolean;
    static isDateExact(value: unknown): boolean;
    static isDateRelative(value: unknown): boolean;
    static isDate(value: unknown): boolean;
    static isBuiltIn(value: unknown): value is BuiltInSearchTokenType;
    static isExactFilterType(value: unknown): boolean;
}
