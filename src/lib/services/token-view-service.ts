import { SearchTokenModel, type BuiltInSearchTokenType, type SearchToken } from '../models/search-token'

interface TokenCategoryResolverOptions {
  getColumnByKey?: (key: string) => { label: string } | undefined
  suggestionCategoryLabelByType?: Record<string, string>
}

const builtInTokenIconByType: Record<BuiltInSearchTokenType, string> = {
  [SearchTokenModel.fulltext]: 'search',
  [SearchTokenModel.scope]: 'tune',
  [SearchTokenModel.dateBefore]: 'event_busy',
  [SearchTokenModel.dateAfter]: 'event_available',
  [SearchTokenModel.dateExact]: 'event',
  [SearchTokenModel.dateRelative]: 'event_repeat',
}

export const resolveTokenIcon = (token: SearchToken): string | undefined => {
  if ('icon' in token && token.icon) {
    return token.icon
  }

  if (SearchTokenModel.isBuiltIn(token)) {
    return builtInTokenIconByType[token.type]
  }

  return undefined
}

export const resolveTokenCategory = (
  token: SearchToken,
  options?: TokenCategoryResolverOptions,
): string => {
  const mapped = options?.suggestionCategoryLabelByType?.[token.type]
  if (mapped) {
    return mapped
  }

  if (SearchTokenModel.isDateBefore(token)) {
    return 'date before'
  }

  if (SearchTokenModel.isDateAfter(token)) {
    return 'date after'
  }

  if (SearchTokenModel.isDateExact(token)) {
    return 'date exact'
  }

  if (SearchTokenModel.isDateRelative(token)) {
    if (token.dateRelation === 'before') {
      return 'date before'
    }

    if (token.dateRelation === 'after') {
      return 'date after'
    }

    return 'date exact'
  }

  if (SearchTokenModel.isFulltext(token)) {
    return 'Fulltext'
  }

  if (SearchTokenModel.isScope(token)) {
    return 'Fulltext scope'
  }

  const key = 'key' in token ? token.key : undefined
  if (key) {
    const column = options?.getColumnByKey?.(key)
    if (column?.label) {
      return column.label
    }
  }

  return token.type
}
