export declare enum DateRelation {
    Before = "before",
    After = "after",
    On = "on"
}
export type DateRelationValue = `${DateRelation}`;
export declare const isDateRelationBefore: (value: unknown) => value is DateRelationValue;
export declare const isDateRelationAfter: (value: unknown) => value is DateRelationValue;
export declare const isDateRelationOn: (value: unknown) => value is DateRelationValue;
export declare const isDateRelation: (value: unknown) => value is DateRelationValue;
