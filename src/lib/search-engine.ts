import type { SearchModelDefinition } from './models/external'
import type { SearchToken } from './models/internal'
import {
  highlightTextService,
  resolveEnglishLocaleService,
} from './services/highlight-service'
import { filterItemsService } from './services/filter-service'
import { buildSuggestionsService } from './services/suggestion-service'

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

class SearchEngineApplicationService {
  constructor(private readonly dependencies: SearchEngineDependencies) {
  }

  resolveEnglishLocale(): string {
    return this.dependencies.resolveEnglishLocale()
  }

  highlightText(value: HighlightableValue, terms: string[]): string {
    return this.dependencies.highlightText(value, terms)
  }

  filterItems<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
  ): TItem[] {
    return this.dependencies.filterItems(items, modelDefinition, selected)
  }

  buildSuggestions<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    return this.dependencies.buildSuggestions(items, modelDefinition, selected, rawInput)
  }
}

const defaultSearchEngineDependencies: SearchEngineDependencies = {
  resolveEnglishLocale: resolveEnglishLocaleService,
  highlightText: highlightTextService,
  filterItems: filterItemsService,
  buildSuggestions: buildSuggestionsService,
}

export const createSearchEngine = (
  overrides: Partial<SearchEngineDependencies> = {},
) => {
  const dependencies: SearchEngineDependencies = {
    ...defaultSearchEngineDependencies,
    ...overrides,
  }
  const searchEngineApplicationService = new SearchEngineApplicationService(dependencies)

  return {
    resolveEnglishLocale: (): string => searchEngineApplicationService.resolveEnglishLocale(),
    highlightText: (value: HighlightableValue, terms: string[]): string =>
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
