import type { SearchToken } from '../types'

export type {
  RelativeSearchInput,
  SearchAnchor,
  SearchDirection,
  SearchToken,
  SearchTokenType,
} from '../types'

export interface ParsedSearchSelectionState {
  fullTextTokens: SearchToken[]
  exactTokens: SearchToken[]
  scopedColumnKeys: string[]
}

export interface RankedSearchToken extends SearchToken {
  _score: number
  _columnType: string
}
