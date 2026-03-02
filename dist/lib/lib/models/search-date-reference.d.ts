import { DateReference as DateReferenceEnum } from './date-reference';
export type DateReference = `${DateReferenceEnum}`;
export declare class DateReferenceValueObject {
    static readonly last: DateReference;
    static readonly next: DateReference;
    static isLast(value: unknown): value is DateReference;
    static isNext(value: unknown): value is DateReference;
    static isValid(value: unknown): value is DateReference;
}
