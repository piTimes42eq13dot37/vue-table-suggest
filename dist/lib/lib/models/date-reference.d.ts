export declare enum DateReference {
    Last = "last",
    Next = "next"
}
export type DateReferenceValue = `${DateReference}`;
export declare const isDateReferenceLast: (value: unknown) => value is DateReferenceValue;
export declare const isDateReferenceNext: (value: unknown) => value is DateReferenceValue;
export declare const isDateReference: (value: unknown) => value is DateReferenceValue;
