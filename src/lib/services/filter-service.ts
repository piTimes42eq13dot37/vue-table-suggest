import { parseDateInput } from '../date'
import {
  isDateToken,
  parseSelection,
  resolveTermKey,
} from '../domain/search-model'
import type { SearchModelDefinition } from '../models/external'
import type { SearchToken } from '../models/internal'
import { getScopeColumns, normalizeNumberLike, readValue } from './value-service'

export const filterItems = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] => {
  const { fullTextTokens, exactTokens, scopedColumnKeys } = parseSelection(selected)
  const scopedColumns = getScopeColumns(annotations, scopedColumnKeys)

  return items.filter((item) => {
    for (const term of exactTokens) {
      const resolvedKey = resolveTermKey(term)
      const column = annotations.columns.find((value) => value.key === resolvedKey)
      const value = column ? readValue(item, column) : ''

      if (isDateToken(term)) {
        const rowDate = parseDateInput(value)
        const termDate = parseDateInput(term.rawTitle || term.title)
        if (!rowDate || !termDate) return false

        const rowTime = rowDate.getTime()
        const termTime = termDate.getTime()

        if ((term.type === 'date_before' || term.direction === 'before') && !(rowTime < termTime)) {
          return false
        }

        if ((term.type === 'date_after' || term.direction === 'after') && !(rowTime > termTime)) {
          return false
        }

        if ((term.type === 'date_exact' || term.direction === 'on') && rowTime !== termTime) {
          return false
        }

        continue
      }

      if (column?.valueType === 'number-like') {
        if (normalizeNumberLike(value) !== normalizeNumberLike(term.title)) {
          return false
        }
        continue
      }

      if (String(value).toLowerCase() !== String(term.title || '').toLowerCase()) {
        return false
      }
    }

    for (const token of fullTextTokens) {
      const needle = String(token.title || '').toLowerCase()
      if (!needle) continue

      const found = scopedColumns.some((column) =>
        String(readValue(item, column)).toLowerCase().includes(needle),
      )
      if (!found) return false
    }

    return true
  })
}
