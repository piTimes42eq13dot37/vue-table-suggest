declare class DateDomainService {
    startOfDay(date: Date): Date;
    parseDateInput(value: string): Date | null;
    formatDate(date: Date): string;
    getMondayIndexFromDate(date: Date): number;
    getLocalizedWeekdaysMondayFirst(locale?: string): string[];
    getReferenceWeekdayDate(reference: 'last' | 'next', weekdayIndexMonday: number, now?: Date): Date;
    getIsoWeekInfo(date: Date): {
        weekNo: number;
        weekYear: number;
    };
    getDateMouseoverLabel(dateValue: string, locale?: string): string;
}
export declare const dateDomainService: DateDomainService;
export {};
