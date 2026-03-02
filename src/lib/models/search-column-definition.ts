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
