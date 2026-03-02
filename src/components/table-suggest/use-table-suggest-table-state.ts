import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { dateDomainService } from '../../lib/services/date-service'
import { filterItems, resolveEnglishLocale } from '../../lib/search-engine'
import type { SearchColumnDefinition, SearchModelDefinition } from '../../lib/models/external'
import type { SearchToken } from '../../lib/models/search-token'
import { formatGroupedNumber } from '../../lib/services/value-service'
import {
  tableSuggestPresenterService,
  type HighlightSegment,
} from '../../lib/services/table-suggest-presenter-service'

interface UseTableSuggestTableStateInput<TItem extends object> {
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
  selected: Ref<SearchToken[]>
  fulltextTerms: Ref<string[]>
  scopedKeys: Ref<string[]>
  query: Ref<string>
}

export const useTableSuggestTableState = <TItem extends object>(
  input: UseTableSuggestTableStateInput<TItem>,
) => {
  const resolveInitialSortKey = (): string =>
    input.modelDefinition.columns.find((column) => !column.renderAsSublineOf && column.sortable !== false)?.key ?? ''

  const sortState = ref<{ key: string; asc: boolean }>({ key: resolveInitialSortKey(), asc: true })

  const locale = computed(() => input.modelDefinition.locale ?? resolveEnglishLocale())
  const textCollator = computed(
    () => new Intl.Collator(locale.value, { numeric: true, sensitivity: 'base' }),
  )

  const visibleColumns = computed(() =>
    input.modelDefinition.columns.filter((column) => !column.renderAsSublineOf),
  )

  const sublineColumnsByParent = computed(() => {
    return tableSuggestPresenterService.groupSublineColumnsByParent(input.modelDefinition.columns)
  })

  const filtered = computed(() => filterItems(input.items, input.modelDefinition, input.selected.value))

  const sortedRows = computed(() => {
    return tableSuggestPresenterService.sortRows(
      filtered.value,
      input.modelDefinition.columns,
      sortState.value,
      (a, b) => textCollator.value.compare(a, b),
      (value) => dateDomainService.parseDateInput(value),
    )
  })

  const showHighlightForColumn = (key: string): boolean => {
    return tableSuggestPresenterService.shouldHighlightColumn(
      key,
      input.fulltextTerms.value,
      input.scopedKeys.value,
      input.modelDefinition.columns,
    )
  }

  const getColumnByKey = (key: string): SearchColumnDefinition<TItem> | undefined =>
    input.modelDefinition.columns.find((column) => column.key === key)

  const getSublineColumns = (key: string): SearchColumnDefinition<TItem>[] =>
    sublineColumnsByParent.value.get(key) ?? []

  const renderCellValue = (item: TItem, key: string): string => {
    const column = getColumnByKey(key)
    const toDisplay = (raw: unknown): string => {
      if (column?.valueType === 'number-like') {
        return formatGroupedNumber(raw)
      }
      return String(raw ?? '')
    }

    if (column?.accessor) {
      return toDisplay(column.accessor(item))
    }

    const data = item as Record<string, unknown>
    return toDisplay(data[key])
  }

  const getTooltip = (item: TItem, key: string): string => {
    const column = getColumnByKey(key)
    if (!column?.tooltipHint) return ''
    if (typeof column.tooltipHint === 'function') return column.tooltipHint(item)
    return column.tooltipHint
  }

  const toggleSort = (key: string): void => {
    const column = getColumnByKey(key)
    if (column?.sortable === false) return

    if (sortState.value.key !== key) {
      sortState.value = { key, asc: true }
      return
    }

    sortState.value = { key, asc: !sortState.value.asc }
  }

  const sortIcon = (key: string): string | null => {
    if (sortState.value.key !== key) return null
    return sortState.value.asc ? 'arrow_upward' : 'arrow_downward'
  }

  const cellSegments = (item: TItem, key: string): HighlightSegment[] => {
    const value = renderCellValue(item, key)
    if (!showHighlightForColumn(key)) return [{ text: value, highlighted: false }]
    return tableSuggestPresenterService.buildHighlightSegments(value, input.fulltextTerms.value)
  }

  const suggestionTitleSegments = (title: string): HighlightSegment[] =>
    tableSuggestPresenterService.buildHighlightSegments(title, [input.query.value])

  const dateHint = (item: TItem): string => {
    const raw = renderCellValue(item, 'date')
    return dateDomainService.getDateMouseoverLabel(raw, locale.value)
  }

  return {
    visibleColumns,
    sortedRows,
    getColumnByKey,
    getSublineColumns,
    getTooltip,
    toggleSort,
    sortIcon,
    cellSegments,
    suggestionTitleSegments,
    dateHint,
  }
}
