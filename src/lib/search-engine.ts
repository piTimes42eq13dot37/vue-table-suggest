import type { SearchModelDefinition } from './models/external'
import type { SearchToken } from './models/internal'
import {
  highlightText as highlightTextDomainService,
  resolveEnglishLocale as resolveEnglishLocaleDomainService,
} from './services/highlight-service'
import { filterItems as filterItemsDomainService } from './services/filter-service'
import { buildSuggestions as buildSuggestionsDomainService } from './services/suggestion-service'

type HighlightableValue = string | number | boolean | Date | null | undefined

export interface SearchEngineDependencies {
  resolveEnglishLocale: () => string
  highlightText: (value: HighlightableValue, terms: string[]) => string
  filterItems: <TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
  ) => TItem[]
  buildSuggestions: <TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ) => SearchToken[]
}

const defaultSearchEngineDependencies: SearchEngineDependencies = {
  resolveEnglishLocale: resolveEnglishLocaleDomainService,
  highlightText: highlightTextDomainService,
  filterItems: filterItemsDomainService,
  buildSuggestions: buildSuggestionsDomainService,
}

export const createSearchEngine = (
  overrides: Partial<SearchEngineDependencies> = {},
) => {
  const dependencies: SearchEngineDependencies = {
    ...defaultSearchEngineDependencies,
    ...overrides,
  }

  return {
    resolveEnglishLocale: (): string => dependencies.resolveEnglishLocale(),
    highlightText: (value: HighlightableValue, terms: string[]): string =>
      dependencies.highlightText(value, terms),
    filterItems: <TItem>(
      items: TItem[],
      modelDefinition: SearchModelDefinition<TItem>,
      selected: SearchToken[],
    ): TItem[] =>
      dependencies.filterItems(items, modelDefinition, selected),
    buildSuggestions: <TItem>(
      items: TItem[],
      modelDefinition: SearchModelDefinition<TItem>,
      selected: SearchToken[],
      rawInput: string,
    ): SearchToken[] =>
      dependencies.buildSuggestions(items, modelDefinition, selected, rawInput),
  }
}

export const searchEngine = createSearchEngine()

export const resolveEnglishLocale = (): string => searchEngine.resolveEnglishLocale()

export const highlightText = (value: HighlightableValue, terms: string[]): string =>
  searchEngine.highlightText(value, terms)

export const filterItems = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
): TItem[] => searchEngine.filterItems(items, modelDefinition, selected)

export const buildSuggestions = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] =>
  searchEngine.buildSuggestions(items, modelDefinition, selected, rawInput)
