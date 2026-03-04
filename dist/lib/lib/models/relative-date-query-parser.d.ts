import type { DateReference } from './date-reference';
import { DateRelation } from './date-relation';
export interface RelativeDateQuery {
    dateRelation: DateRelation;
    reference: DateReference | null;
    weekdayPart: string;
    needle: string;
}
declare class RelativeDateQueryParser {
    parse(rawInput: string): RelativeDateQuery | null;
}
export declare const relativeDateQueryParser: RelativeDateQueryParser;
export {};
