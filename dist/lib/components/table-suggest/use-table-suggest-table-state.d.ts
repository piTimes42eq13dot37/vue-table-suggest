import type { Ref } from 'vue';
import type { SearchColumnDefinition, SearchModelDefinition } from '../../lib/models/external';
import type { SearchToken } from '../../lib/models/search-token';
import { type HighlightSegment } from '../../lib/services/table-suggest-presenter-service';
interface UseTableSuggestTableStateInput<TItem extends object> {
    items: TItem[];
    modelDefinition: SearchModelDefinition<TItem>;
    selected: Ref<SearchToken[]>;
    fulltextTerms: Ref<string[]>;
    scopedKeys: Ref<string[]>;
    query: Ref<string>;
}
export declare const useTableSuggestTableState: <TItem extends object>(input: UseTableSuggestTableStateInput<TItem>) => {
    visibleColumns: import("vue").ComputedRef<SearchColumnDefinition<TItem>[]>;
    sortedRows: import("vue").ComputedRef<TItem[]>;
    getColumnByKey: (key: string) => SearchColumnDefinition<TItem> | undefined;
    getSublineColumns: (key: string) => SearchColumnDefinition<TItem>[];
    getTooltip: (item: TItem, key: string) => string;
    toggleSort: (key: string) => void;
    sortIcon: (key: string) => string | null;
    cellSegments: (item: TItem, key: string) => HighlightSegment[];
    suggestionTitleSegments: (title: string) => HighlightSegment[];
    dateHint: (item: TItem) => string;
};
export {};
