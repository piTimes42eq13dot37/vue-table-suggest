import { dateDomainService } from './date-service'
import {
  SearchSelection,
} from '../models/search-selection'
import { SearchTokenModel } from '../models/search-token'
import type { SearchModelDefinition } from '../models/external'
import type { SearchToken } from '../models/internal'
import { getScopeColumns, normalizeNumberLike, readValue } from './value-service'

class FilterService {
  filterItems<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
  ): TItem[] {
    const selection = SearchSelection.from(selected)
    const { fulltextTokens, exactTokens, scopedColumnKeys } = selection.toParsedState()
    const scopedColumns = getScopeColumns(modelDefinition, scopedColumnKeys)

    return items.filter((item) => {
      for (const term of exactTokens) {
        const resolvedKey = SearchTokenModel.resolveTermKey(term)
        const column = modelDefinition.columns.find((value) => value.key === resolvedKey)
        const value = column ? readValue(item, column) : ''

        if (SearchTokenModel.isDate(term)) {
          const rowDate = dateDomainService.parseDateInput(value)
          const termDate = dateDomainService.parseDateInput(term.rawTitle || term.title)
          if (!rowDate || !termDate) return false

          const rowTime = rowDate.getTime()
          const termTime = termDate.getTime()

          if (SearchTokenModel.isBeforeDirection(term) && !(rowTime < termTime)) {
            return false
          }

          if (SearchTokenModel.isAfterDirection(term) && !(rowTime > termTime)) {
            return false
          }

          if (SearchTokenModel.isOnDirection(term) && rowTime !== termTime) {
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

      for (const token of fulltextTokens) {
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
}

const filterService = new FilterService()

export const filterItemsService = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] =>
  filterService.filterItems(items, modelDefinition, selected)

export const filterItems = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] =>
  filterItemsService(items, modelDefinition, selected)
