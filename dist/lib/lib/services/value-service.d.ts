import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external';
export declare const normalizeNumberLike: (value: unknown) => string;
export declare const formatGroupedNumber: (value: unknown) => string;
export declare const readValue: <TItem>(item: TItem, column: SearchColumnDefinition<TItem>) => string;
export declare const getScopeColumns: <TItem>(annotations: SearchModelDefinition<TItem>, selectedScopeKeys: string[]) => SearchColumnDefinition<TItem>[];
export declare const expandScopeKeys: <TItem>(annotations: SearchModelDefinition<TItem>, scopeKeys: string[]) => string[];
export declare const readValueByKey: <TItem>(item: TItem, annotations: SearchModelDefinition<TItem>, key: string) => string;
