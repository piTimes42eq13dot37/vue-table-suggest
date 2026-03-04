export declare enum DateReference {
    Last = "last",
    Next = "next"
}
export declare const isDateReferenceLast: (value: string) => value is DateReference;
export declare const isDateReferenceNext: (value: string) => value is DateReference;
export declare const isDateReference: (value: string) => value is DateReference;
