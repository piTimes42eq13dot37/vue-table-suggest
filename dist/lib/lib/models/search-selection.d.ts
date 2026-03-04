import type { ParsedSearchSelectionState } from './internal';
import type { SearchToken as SearchTokenData } from './internal';
export declare class SearchSelection {
    private readonly selected;
    private readonly fulltext;
    private readonly exact;
    private readonly scopedKeys;
    private constructor();
    static from(selected: SearchTokenData[]): SearchSelection;
    get fulltextTokens(): SearchTokenData[];
    get exactTokens(): SearchTokenData[];
    get scopedColumnKeys(): string[];
    toParsedState(): ParsedSearchSelectionState;
}
