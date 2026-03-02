import type { Ref } from 'vue';
import type { SearchModelDefinition } from '../../lib/models/external';
import type { SearchToken } from '../../lib/models/search-token';
export type SelectInputUpdater = (value: string, noFilter?: boolean, keepInputValue?: boolean) => void;
export type CreateValueDone = (value: null) => void;
export type FilterUpdateHandler = (fn: () => void) => void;
interface UseTableSuggestSearchStateInput<TItem extends object> {
    items: TItem[];
    modelDefinition: SearchModelDefinition<TItem>;
}
interface UseTableSuggestSearchStateResult {
    query: Ref<string>;
    selected: Ref<SearchToken[]>;
    filterOptions: Ref<SearchToken[]>;
    qSelectRef: Ref<{
        updateInputValue?: SelectInputUpdater;
        hidePopup?: () => void;
    } | null>;
    fulltextTerms: Ref<string[]>;
    scopedKeys: Ref<string[]>;
    createValue: (value: string, done: CreateValueDone) => void;
    filterFn: (value: string, update: FilterUpdateHandler) => void;
}
export declare const useTableSuggestSearchState: <TItem extends object>(input: UseTableSuggestSearchStateInput<TItem>) => UseTableSuggestSearchStateResult;
export {};
