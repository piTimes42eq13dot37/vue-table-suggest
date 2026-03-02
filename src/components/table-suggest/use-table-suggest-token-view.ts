import type { SearchColumnDefinition, SearchModelDefinition } from '../../lib/models/external'
import type { SearchToken } from '../../lib/models/search-token'

const defaultTokenColorByType: Record<string, string> = {
  fulltext: 'teal-9',
  scope: 'green-8',
  subcolumn: 'light-blue-9',
}

const defaultTokenTypeLabelByType: Record<string, string> = {
  date_before: 'Date before',
  date_after: 'Date after',
  date_exact: 'Date exact',
  date_relative: 'Date',
  fulltext: 'Full-Text',
  scope: 'In Column',
}

export const useTableSuggestTokenView = <TItem extends object>(
  modelDefinition: SearchModelDefinition<TItem>,
  getColumnByKey: (key: string) => SearchColumnDefinition<TItem> | undefined,
) => {
  const isSubColumnToken = (token: SearchToken): boolean => {
    const key = token.key ?? token.type
    const column = getColumnByKey(key)
    return Boolean(column?.renderAsSublineOf)
  }

  const chipTypeLabel = (token: SearchToken): string => {
    if (token.type === 'scope' && isSubColumnToken(token)) {
      return 'In SubColumn'
    }

    const mappedLabel =
      modelDefinition.tokenTypeLabelByType?.[token.type] ??
      defaultTokenTypeLabelByType[token.type]

    if (mappedLabel) return mappedLabel
    const key = token.key ?? token.type
    const column = getColumnByKey(key)
    return column?.label ?? token.category ?? token.type
  }

  const resolveDefaultTokenColor = (token: SearchToken): string | undefined => {
    if (defaultTokenColorByType[token.type]) return defaultTokenColorByType[token.type]

    const key = token.key ?? token.type
    const column = getColumnByKey(key)
    if (column?.renderAsSublineOf) {
      return defaultTokenColorByType.subcolumn
    }

    return undefined
  }

  const resolveTokenColor = (
    token: SearchToken,
    colorByType?: Record<string, string>,
    fallback?: string,
  ): string => {
    return (
      colorByType?.[token.type] ??
      resolveDefaultTokenColor(token) ??
      fallback ??
      modelDefinition.tokenDefaultColor ??
      'indigo-9'
    )
  }

  const chipColor = (token: SearchToken): string =>
    resolveTokenColor(token, modelDefinition.tokenColorByType)

  const optionBadgeColor = (token: SearchToken): string =>
    resolveTokenColor(token, modelDefinition.optionBadgeColorByType, chipColor(token))

  const suggestionCategoryLabel = (token: SearchToken): string => {
    const mappedLabel = modelDefinition.suggestionCategoryLabelByType?.[token.type]
    if (mappedLabel) return mappedLabel

    if (isSubColumnToken(token)) {
      const key = token.key ?? token.type
      const column = getColumnByKey(key)
      const parentLabel = column?.renderAsSublineOf
        ? getColumnByKey(column.renderAsSublineOf)?.label
        : undefined
      return `${parentLabel ?? column?.label ?? token.category ?? token.type}-SubColumn`
    }

    return token.category ?? token.type
  }

  return {
    chipTypeLabel,
    chipColor,
    optionBadgeColor,
    suggestionCategoryLabel,
  }
}
