import type { DateReference, SearchDirection } from './internal';
export interface RelativeDateQuery {
    direction: SearchDirection;
    reference: DateReference | null;
    weekdayPart: string;
    needle: string;
}
declare class RelativeDateQueryParser {
    parse(rawInput: string): RelativeDateQuery | null;
}
export declare const relativeDateQueryParser: RelativeDateQueryParser;
export {};
