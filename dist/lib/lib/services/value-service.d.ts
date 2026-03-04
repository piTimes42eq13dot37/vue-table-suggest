import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external';
type PrimitiveCellValue = string | number | boolean | Date | null | undefined;
export declare const normalizeNumberLike: (value: PrimitiveCellValue) => string;
export declare const formatGroupedNumber: (value: PrimitiveCellValue) => string;
export declare const readValue: <TItem>(item: TItem, column: SearchColumnDefinition<TItem>) => string;
export declare const getScopeColumns: <TItem>(modelDefinition: SearchModelDefinition<TItem>, selectedScopeKeys: string[]) => SearchColumnDefinition<TItem>[];
export declare const expandScopeKeys: <TItem>(modelDefinition: SearchModelDefinition<TItem>, scopeKeys: string[]) => string[];
export declare const readValueByKey: <TItem>(item: TItem, modelDefinition: SearchModelDefinition<TItem>, key: string) => string;
export {};
