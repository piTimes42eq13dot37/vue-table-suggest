import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external'

export const normalizeNumberLike = (value: unknown): string =>
  String(value ?? '').replace(/[^0-9]/g, '')

export const formatGroupedNumber = (value: unknown): string => {
  const digits = normalizeNumberLike(value)
  if (!digits) return String(value ?? '')
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const readValue = <TItem>(item: TItem, column: SearchColumnDefinition<TItem>): string => {
  if (column.accessor) {
    return String(column.accessor(item) ?? '')
  }

  const key = column.key as keyof TItem
  return String(item[key] ?? '')
}

export const getScopeColumns = <TItem>(
  annotations: SearchModelDefinition<TItem>,
  selectedScopeKeys: string[],
): SearchColumnDefinition<TItem>[] => {
  if (!selectedScopeKeys.length) {
    return annotations.columns.filter((column) => column.searchable !== false)
  }

  const selected = new Set(selectedScopeKeys)
  const grouped = new Set<string>()
  annotations.columns.forEach((column) => {
    if (selected.has(column.key) && column.scopeGroup) {
      grouped.add(column.scopeGroup)
    }
  })

  return annotations.columns.filter((column) => {
    if (!selected.has(column.key) && !grouped.has(column.scopeGroup ?? '')) {
      return false
    }
    return column.searchable !== false
  })
}

export const expandScopeKeys = <TItem>(
  annotations: SearchModelDefinition<TItem>,
  scopeKeys: string[],
): string[] => {
  const selected = new Set(scopeKeys)
  const grouped = new Set<string>()

  annotations.columns.forEach((column) => {
    if (selected.has(column.key) && column.scopeGroup) {
      grouped.add(column.scopeGroup)
    }
  })

  return Array.from(
    new Set(
      annotations.columns
        .filter((column) => selected.has(column.key) || grouped.has(column.scopeGroup ?? ''))
        .map((column) => column.key),
    ),
  )
}

export const readValueByKey = <TItem>(
  item: TItem,
  annotations: SearchModelDefinition<TItem>,
  key: string,
): string => {
  const column = annotations.columns.find((entry) => entry.key === key)
  if (column) return readValue(item, column)
  return String((item as Record<string, unknown>)[key] ?? '')
}
