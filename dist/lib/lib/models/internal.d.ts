import type { SearchToken } from './search-token';
export type { RelativeSearchInput, } from './relative-search-input';
export type { DateReference, } from './date-reference';
export type { DateRelation, } from './date-relation';
export type { BuiltInSearchTokenType, DateOperationToken, DateSearchToken, DateRelativeToken, FulltextColumnScopeToken, ExactCellValueToken, SearchToken, SearchTokenType, } from './search-token';
export interface ParsedSearchSelectionState {
    fulltextTokens: SearchToken[];
    exactTokens: SearchToken[];
    scopedColumnKeys: string[];
}
export type RankedSearchToken = SearchToken & {
    _score: number;
    _columnType: string;
};
