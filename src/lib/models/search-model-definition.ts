import type { SearchColumnDefinition } from './search-column-definition'

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
