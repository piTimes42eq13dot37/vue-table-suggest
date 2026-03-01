export type SearchDirection = 'before' | 'after' | 'on'
export type SearchAnchor = 'last' | 'next'

export type SearchTokenType =
  | 'fulltext'
  | 'scope'
  | 'date_before'
  | 'date_after'
  | 'date_exact'
  | 'date_relative'
  | string

export interface SearchToken {
  uid: string
  type: SearchTokenType
  title: string
  rawTitle?: string
  category?: string
  icon?: string
  key?: string
  direction?: SearchDirection
  anchor?: SearchAnchor
  matchCount?: number
}

export interface SearchColumnDefinition<TItem> {
  key: string
  label: string
  icon?: string
  sortable?: boolean
  searchable?: boolean
  tooltipHint?: string | ((item: TItem) => string)
  scopeGroup?: string
  accessor?: (item: TItem) => unknown
  suggestionEnabled?: boolean
  valueType?: 'text' | 'number-like'
  renderAsSublineOf?: string
}

export interface SearchModelDefinition<TItem> {
  modelName: string
  locale?: string
  maxSuggestions?: number
  maxWeekdaySuggestions?: number
  tokenColorByType?: Record<string, string>
  optionBadgeColorByType?: Record<string, string>
  tokenDefaultColor?: string
  dateParser?: (value: string) => Date | null
  dateFormatter?: (date: Date) => string
  columns: SearchColumnDefinition<TItem>[]
}

export interface RelativeSearchInput {
  direction: SearchDirection
  anchor: SearchAnchor
  weekdayIndexMonday: number
  weekday: string
}

export type SuggestDirection = SearchDirection
export type SuggestAnchor = SearchAnchor
export type TokenType = SearchTokenType
export type SuggestToken = SearchToken
export type ColumnAnnotation<TItem> = SearchColumnDefinition<TItem>
export type ModelAnnotations<TItem> = SearchModelDefinition<TItem>
export type RelativeSuggestionInput = RelativeSearchInput
