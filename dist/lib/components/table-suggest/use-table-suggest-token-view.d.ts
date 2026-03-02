import type { SearchColumnDefinition, SearchModelDefinition } from '../../lib/models/external';
import type { SearchToken } from '../../lib/models/search-token';
export declare const useTableSuggestTokenView: <TItem extends object>(modelDefinition: SearchModelDefinition<TItem>, getColumnByKey: (key: string) => SearchColumnDefinition<TItem> | undefined) => {
    chipTypeLabel: (token: SearchToken) => string;
    chipColor: (token: SearchToken) => string;
    optionBadgeColor: (token: SearchToken) => string;
    suggestionCategoryLabel: (token: SearchToken) => string;
};
