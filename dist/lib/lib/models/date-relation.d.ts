export declare enum DateRelation {
    Before = "before",
    After = "after",
    On = "on"
}
export declare const isDateRelationBefore: (value: string) => value is DateRelation;
export declare const isDateRelationAfter: (value: string) => value is DateRelation;
export declare const isDateRelationOn: (value: string) => value is DateRelation;
export declare const isDateRelation: (value: string) => value is DateRelation;
