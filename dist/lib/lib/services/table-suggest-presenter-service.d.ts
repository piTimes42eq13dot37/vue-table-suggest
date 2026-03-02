import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external';
export interface TableSortState {
    key: string;
    asc: boolean;
}
export interface HighlightSegment {
    text: string;
    highlighted: boolean;
}
declare class TableSuggestPresenterService {
    private escapeRegExp;
    private normalizeDigits;
    private buildTermPattern;
    private mergeRanges;
    groupSublineColumnsByParent<TItem>(columns: SearchModelDefinition<TItem>['columns']): Map<string, SearchColumnDefinition<TItem>[]>;
    sortRows<TItem extends object>(rows: TItem[], columns: SearchModelDefinition<TItem>['columns'], sortState: TableSortState, compareText: (a: string, b: string) => number, parseDate: (value: string) => Date | null): TItem[];
    shouldHighlightColumn<TItem>(key: string, fulltextTerms: string[], scopedKeys: string[], columns: SearchModelDefinition<TItem>['columns']): boolean;
    buildHighlightSegments(value: string, terms: string[]): HighlightSegment[];
}
export declare const tableSuggestPresenterService: TableSuggestPresenterService;
export {};
