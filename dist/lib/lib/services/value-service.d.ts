import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external';
export declare const normalizeNumberLike: (value: unknown) => string;
export declare const formatGroupedNumber: (value: unknown) => string;
export declare const readValue: <TItem>(item: TItem, column: SearchColumnDefinition<TItem>) => string;
export declare const getScopeColumns: <TItem>(modelDefinition: SearchModelDefinition<TItem>, selectedScopeKeys: string[]) => SearchColumnDefinition<TItem>[];
export declare const expandScopeKeys: <TItem>(modelDefinition: SearchModelDefinition<TItem>, scopeKeys: string[]) => string[];
export declare const readValueByKey: <TItem>(item: TItem, modelDefinition: SearchModelDefinition<TItem>, key: string) => string;
