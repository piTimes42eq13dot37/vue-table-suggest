import type { DateReference as DateReference, SearchDirection, SearchToken } from './internal';
import { SearchTokenTypeValueObject } from './search-token-type';
type DateOperationTokenType = typeof SearchTokenTypeValueObject.dateBefore | typeof SearchTokenTypeValueObject.dateAfter | typeof SearchTokenTypeValueObject.dateExact;
export declare class SearchTokenFactory {
    private static getDateCategoryFromDirection;
    private static getDateOperationMetadata;
    static createDateRelative(input: {
        direction: SearchDirection;
        reference: DateReference;
        weekdayIndexMonday: number;
        dateText: string;
        title: string;
    }): SearchToken;
    static createDateOperation(type: DateOperationTokenType, dateText: string): SearchToken;
    static createScope(input: {
        key: string;
        title: string;
        icon?: string;
    }): SearchToken;
}
export {};
