import type { SearchModelDefinition } from './models/external'
import type { SearchToken } from './models/internal'
import {
  highlightText as highlightTextService,
  resolveEnglishLocale as resolveEnglishLocaleService,
} from './services/highlight-service'
import { filterItems as filterItemsService } from './services/filter-service'
import { buildSuggestions as buildSuggestionsService } from './services/suggestion-service'

export const resolveEnglishLocale = (): string => resolveEnglishLocaleService()

export const highlightText = (value: unknown, terms: string[]): string =>
  highlightTextService(value, terms)

export const filterItems = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] => filterItemsService(items, annotations, selected)

export const buildSuggestions = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] => buildSuggestionsService(items, annotations, selected, rawInput)
