import type { ParsedSearchSelectionState } from '../models/internal'
import type { SearchToken } from '../models/internal'

export const parseSelection = (selected: SearchToken[]): ParsedSearchSelectionState => ({
  fullTextTokens: selected.filter((token) => token.type === 'fulltext'),
  exactTokens: selected.filter((token) => !['fulltext', 'scope'].includes(token.type)),
  scopedColumnKeys: selected
    .filter((token) => token.type === 'scope' && token.key)
    .map((token) => token.key!),
})

export const isDateToken = (token: SearchToken): boolean =>
  token.type === 'date_before' ||
  token.type === 'date_after' ||
  token.type === 'date_exact' ||
  token.type === 'date_relative'

export const resolveTermKey = (token: SearchToken): string =>
  token.key ?? (token.type.startsWith('date_') || token.type === 'date_relative' ? 'date' : token.type)
