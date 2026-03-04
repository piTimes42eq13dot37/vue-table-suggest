import type { DateOperationToken, DateRelativeToken, DateReference, DateRelation, FulltextColumnScopeToken } from './internal';
type DateOperationTokenType = 'date_before' | 'date_after' | 'date_exact';
export declare class SearchTokenFactory {
    static createDateRelative(input: {
        dateRelation: DateRelation;
        reference: DateReference;
        weekdayIndexMonday: number;
        dateText: string;
        title: string;
    }): DateRelativeToken;
    static createDateOperation(type: DateOperationTokenType, dateText: string): DateOperationToken;
    static createScope(input: {
        key: string;
        title: string;
        icon?: string;
    }): FulltextColumnScopeToken;
}
export {};
