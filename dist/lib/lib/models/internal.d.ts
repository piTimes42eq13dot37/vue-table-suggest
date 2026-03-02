import type { SearchToken } from './search-token';
export type { RelativeSearchInput, } from './relative-search-input';
export type { DateReference, } from './search-date-reference';
export type { SearchDirection, } from './search-direction';
export type { SearchToken, } from './search-token';
export type { SearchTokenType, } from './search-token-type';
export interface ParsedSearchSelectionState {
    fullTextTokens: SearchToken[];
    exactTokens: SearchToken[];
    scopedColumnKeys: string[];
}
export interface RankedSearchToken extends SearchToken {
    _score: number;
    _columnType: string;
}
