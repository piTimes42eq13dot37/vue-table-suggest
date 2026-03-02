import type { ParsedSearchSelectionState } from './internal';
import type { SearchToken } from './internal';
export declare class SearchSelection {
    private readonly selected;
    private readonly fulltext;
    private readonly exact;
    private readonly scopedKeys;
    private constructor();
    static from(selected: SearchToken[]): SearchSelection;
    static isExactTokenType(tokenType: string): boolean;
    static isDateToken(token: SearchToken): boolean;
    static isFulltextToken(token: SearchToken): boolean;
    static isScopeToken(token: SearchToken): boolean;
    static isRelativeDateToken(token: SearchToken): boolean;
    static isExactFilterToken(token: SearchToken): boolean;
    static resolveTermKey(token: SearchToken): string;
    static isBeforeDirection(token: SearchToken): boolean;
    static isAfterDirection(token: SearchToken): boolean;
    static isOnDirection(token: SearchToken): boolean;
    get fullTextTokens(): SearchToken[];
    get exactTokens(): SearchToken[];
    get scopedColumnKeys(): string[];
    toParsedState(): ParsedSearchSelectionState;
    isDateToken(token: SearchToken): boolean;
    resolveTermKey(token: SearchToken): string;
}
