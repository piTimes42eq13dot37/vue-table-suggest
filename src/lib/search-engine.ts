import type { SearchModelDefinition } from './models/external'
import type { SearchToken } from './models/internal'
import {
  highlightText as highlightTextService,
  resolveEnglishLocale as resolveEnglishLocaleService,
} from './services/highlight-service'
import { filterItems as filterItemsService } from './services/filter-service'
import { buildSuggestions as buildSuggestionsService } from './services/suggestion-service'

class SearchEngineApplicationService {
  resolveEnglishLocale(): string {
    return resolveEnglishLocaleService()
  }

  highlightText(value: unknown, terms: string[]): string {
    return highlightTextService(value, terms)
  }

  filterItems<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
  ): TItem[] {
    return filterItemsService(items, modelDefinition, selected)
  }

  buildSuggestions<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    return buildSuggestionsService(items, modelDefinition, selected, rawInput)
  }
}

const searchEngineApplicationService = new SearchEngineApplicationService()

export const searchEngine = {
  resolveEnglishLocale: (): string => searchEngineApplicationService.resolveEnglishLocale(),
  highlightText: (value: unknown, terms: string[]): string =>
    searchEngineApplicationService.highlightText(value, terms),
  filterItems: <TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
  ): TItem[] =>
    searchEngineApplicationService.filterItems(items, modelDefinition, selected),
  buildSuggestions: <TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] =>
    searchEngineApplicationService.buildSuggestions(items, modelDefinition, selected, rawInput),
}

export const resolveEnglishLocale = (): string => searchEngine.resolveEnglishLocale()

export const highlightText = (value: unknown, terms: string[]): string =>
  searchEngine.highlightText(value, terms)

export const filterItems = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] => searchEngineApplicationService.filterItems(items, modelDefinition, selected)

export const buildSuggestions = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] =>
  searchEngine.buildSuggestions(items, modelDefinition, selected, rawInput)
