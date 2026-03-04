import type { SearchModelDefinition } from './models/external';
import type { SearchCellValue, SearchColumnDefinition } from './models/search-column-definition';
type Constructor<T> = abstract new (...args: never[]) => T;
type ModelKey<TItem> = Extract<keyof TItem, string>;
type TypedColumnWithKnownKey<TItem> = Omit<SearchColumnDefinition<TItem>, 'key'> & {
    key: ModelKey<TItem>;
};
type TypedColumnWithAccessor<TItem> = Omit<SearchColumnDefinition<TItem>, 'accessor'> & {
    key: string;
    accessor: (item: TItem) => SearchCellValue;
};
export type TypedSearchColumnDefinition<TItem> = TypedColumnWithKnownKey<TItem> | TypedColumnWithAccessor<TItem>;
export type TypedSearchModelDefinition<TItem> = Omit<SearchModelDefinition<TItem>, 'columns'> & {
    columns: TypedSearchColumnDefinition<TItem>[];
};
export declare const defineModelDefinition: <TItem extends object>(ctor: Constructor<TItem>, modelDefinition: SearchModelDefinition<TItem>) => void;
export declare const defineTypedModelDefinition: <TItem extends object>(ctor: Constructor<TItem>, modelDefinition: TypedSearchModelDefinition<TItem>) => void;
export declare const createTypedModelDefinition: <TItem extends object>() => (modelDefinition: TypedSearchModelDefinition<TItem>) => TypedSearchModelDefinition<TItem>;
export declare const getModelDefinition: <TItem extends object>(ctor: Constructor<TItem>) => SearchModelDefinition<TItem>;
export {};
