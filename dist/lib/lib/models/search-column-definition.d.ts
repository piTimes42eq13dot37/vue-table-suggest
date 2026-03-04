export type SearchCellValue = string | number | boolean | Date | null | undefined;
export interface SearchColumnDefinition<TItem> {
    key: string;
    label: string;
    icon?: string;
    sortable?: boolean;
    searchable?: boolean;
    tooltipHint?: string | ((item: TItem) => string);
    scopeGroup?: string;
    accessor?: (item: TItem) => SearchCellValue;
    suggestionEnabled?: boolean;
    valueType?: 'text' | 'number-like';
    renderAsSublineOf?: string;
}
