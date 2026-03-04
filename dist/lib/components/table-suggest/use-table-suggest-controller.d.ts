import type { SearchModelDefinition } from '../../lib/models/external';
export interface TableSuggestProps<TItem extends object> {
    items: TItem[];
    modelDefinition: SearchModelDefinition<TItem>;
}
export declare const useTableSuggestController: <TItem extends object>(props: TableSuggestProps<TItem>) => {
    selected: import("vue").Ref<import("../../public-api").SearchToken[], import("../../public-api").SearchToken[]>;
    filterOptions: import("vue").Ref<import("../../public-api").SearchToken[], import("../../public-api").SearchToken[]>;
    qSelectRef: import("vue").Ref<{
        updateInputValue?: import("./use-table-suggest-search-state").SelectInputUpdater;
        hidePopup?: () => void;
    } | null, {
        updateInputValue?: import("./use-table-suggest-search-state").SelectInputUpdater;
        hidePopup?: () => void;
    } | null>;
    visibleColumns: import("vue").ComputedRef<import("../../public-api").SearchColumnDefinition<TItem>[]>;
    sortedRows: import("vue").ComputedRef<TItem[]>;
    getSublineColumns: (key: string) => import("../../public-api").SearchColumnDefinition<TItem>[];
    createValue: (value: string, done: import("./use-table-suggest-search-state").CreateValueDone) => void;
    filterFn: (value: string, update: import("./use-table-suggest-search-state").FilterUpdateHandler) => void;
    chipColor: (token: import("../../public-api").SearchToken) => string;
    chipTypeLabel: (token: import("../../public-api").SearchToken) => string;
    tokenIcon: (token: import("../../public-api").SearchToken) => string | undefined;
    tokenMatchCount: (token: import("../../public-api").SearchToken) => number;
    optionBadgeColor: (token: import("../../public-api").SearchToken) => string;
    suggestionCategoryLabel: (token: import("../../public-api").SearchToken) => string;
    suggestionTitleSegments: (title: string) => import("../../lib/services/table-suggest-presenter-service").HighlightSegment[];
    toggleSort: (key: string) => void;
    sortIcon: (key: string) => string | null;
    cellSegments: (item: TItem, key: string) => import("../../lib/services/table-suggest-presenter-service").HighlightSegment[];
    dateHint: (item: TItem) => string;
    getTooltip: (item: TItem, key: string) => string;
};
