import type { SearchModelDefinition } from '../../lib/models/external'
import { useTableSuggestSearchState } from './use-table-suggest-search-state'
import { useTableSuggestTableState } from './use-table-suggest-table-state'
import { useTableSuggestTokenView } from './use-table-suggest-token-view'

export interface TableSuggestProps<TItem extends object> {
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
}

export const useTableSuggestController = <TItem extends object>(props: TableSuggestProps<TItem>) => {
  const searchState = useTableSuggestSearchState({
    items: props.items,
    modelDefinition: props.modelDefinition,
  })

  const tableState = useTableSuggestTableState({
    items: props.items,
    modelDefinition: props.modelDefinition,
    selected: searchState.selected,
    fulltextTerms: searchState.fulltextTerms,
    scopedKeys: searchState.scopedKeys,
    query: searchState.query,
  })

  const tokenView = useTableSuggestTokenView(props.modelDefinition, tableState.getColumnByKey)

  return {
    selected: searchState.selected,
    filterOptions: searchState.filterOptions,
    qSelectRef: searchState.qSelectRef,
    visibleColumns: tableState.visibleColumns,
    sortedRows: tableState.sortedRows,
    getSublineColumns: tableState.getSublineColumns,
    createValue: searchState.createValue,
    filterFn: searchState.filterFn,
    chipColor: tokenView.chipColor,
    chipTypeLabel: tokenView.chipTypeLabel,
    optionBadgeColor: tokenView.optionBadgeColor,
    suggestionCategoryLabel: tokenView.suggestionCategoryLabel,
    suggestionTitleSegments: tableState.suggestionTitleSegments,
    toggleSort: tableState.toggleSort,
    sortIcon: tableState.sortIcon,
    cellSegments: tableState.cellSegments,
    dateHint: tableState.dateHint,
    getTooltip: tableState.getTooltip,
  }
}
