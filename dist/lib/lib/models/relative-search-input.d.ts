import type { DateReferenceValue } from './date-reference';
import type { DateRelationValue } from './date-relation';
export interface RelativeSearchInput {
    direction: DateRelationValue;
    reference: DateReferenceValue;
    weekdayIndexMonday: number;
    weekday: string;
}
