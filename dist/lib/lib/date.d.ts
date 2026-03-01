export declare const startOfDay: (date: Date) => Date;
export declare const parseDateInput: (value: string) => Date | null;
export declare const formatDate: (date: Date) => string;
export declare const getMondayIndexFromDate: (date: Date) => number;
export declare const getLocalizedWeekdaysMondayFirst: (locale?: string) => string[];
export declare const getAnchorWeekdayDate: (anchor: "last" | "next", weekdayIndexMonday: number, now?: Date) => Date;
export declare const getIsoWeekInfo: (date: Date) => {
    weekNo: number;
    weekYear: number;
};
export declare const getDateMouseoverLabel: (dateValue: string, locale?: string) => string;
