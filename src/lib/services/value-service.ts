import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external'

class ValueService {
  normalizeNumberLike(value: unknown): string {
    return String(value ?? '').replace(/[^0-9]/g, '')
  }

  formatGroupedNumber(value: unknown): string {
    const digits = this.normalizeNumberLike(value)
    if (!digits) return String(value ?? '')
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  readValue<TItem>(item: TItem, column: SearchColumnDefinition<TItem>): string {
    if (column.accessor) {
      return String(column.accessor(item) ?? '')
    }

    const key = column.key as keyof TItem
    return String(item[key] ?? '')
  }

  getScopeColumns<TItem>(
    modelDefinition: SearchModelDefinition<TItem>,
    selectedScopeKeys: string[],
  ): SearchColumnDefinition<TItem>[] {
    if (!selectedScopeKeys.length) {
      return modelDefinition.columns.filter((column) => column.searchable !== false)
    }

    const selected = new Set(selectedScopeKeys)
    const grouped = new Set<string>()
    modelDefinition.columns.forEach((column) => {
      if (selected.has(column.key) && column.scopeGroup) {
        grouped.add(column.scopeGroup)
      }
    })

    return modelDefinition.columns.filter((column) => {
      if (!selected.has(column.key) && !grouped.has(column.scopeGroup ?? '')) {
        return false
      }
      return column.searchable !== false
    })
  }

  expandScopeKeys<TItem>(
    modelDefinition: SearchModelDefinition<TItem>,
    scopeKeys: string[],
  ): string[] {
    const selected = new Set(scopeKeys)
    const grouped = new Set<string>()

    modelDefinition.columns.forEach((column) => {
      if (selected.has(column.key) && column.scopeGroup) {
        grouped.add(column.scopeGroup)
      }
    })

    return Array.from(
      new Set(
        modelDefinition.columns
          .filter((column) => selected.has(column.key) || grouped.has(column.scopeGroup ?? ''))
          .map((column) => column.key),
      ),
    )
  }

  readValueByKey<TItem>(
    item: TItem,
    modelDefinition: SearchModelDefinition<TItem>,
    key: string,
  ): string {
    const column = modelDefinition.columns.find((entry) => entry.key === key)
    if (column) return this.readValue(item, column)
    return String((item as Record<string, unknown>)[key] ?? '')
  }
}

const valueService = new ValueService()

export const normalizeNumberLike = (value: unknown): string => valueService.normalizeNumberLike(value)

export const formatGroupedNumber = (value: unknown): string => valueService.formatGroupedNumber(value)

export const readValue = <TItem>(item: TItem, column: SearchColumnDefinition<TItem>): string =>
  valueService.readValue(item, column)

export const getScopeColumns = <TItem>(
  modelDefinition: SearchModelDefinition<TItem>,
  selectedScopeKeys: string[],
): SearchColumnDefinition<TItem>[] =>
  valueService.getScopeColumns(modelDefinition, selectedScopeKeys)

export const expandScopeKeys = <TItem>(
  modelDefinition: SearchModelDefinition<TItem>,
  scopeKeys: string[],
): string[] =>
  valueService.expandScopeKeys(modelDefinition, scopeKeys)

export const readValueByKey = <TItem>(
  item: TItem,
  modelDefinition: SearchModelDefinition<TItem>,
  key: string,
): string =>
  valueService.readValueByKey(item, modelDefinition, key)
