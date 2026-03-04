import type { ParsedSearchSelectionState } from './internal'
import type { SearchToken as SearchTokenData } from './internal'
import { SearchTokenModel } from './search-token'

const fulltextTokens = (selected: SearchTokenData[]): SearchTokenData[] =>
  selected.filter((token) => SearchTokenModel.isFulltext(token))

const exactTokens = (selected: SearchTokenData[]): SearchTokenData[] =>
  selected.filter((token) => SearchTokenModel.isExactCellValue(token))

const scopedColumnKeys = (selected: SearchTokenData[]): string[] =>
  selected
    .filter((token) => SearchTokenModel.isScope(token))
    .map((token) => token.key)

export const parseSearchSelectionState = (selected: SearchTokenData[]): ParsedSearchSelectionState => ({
  fulltextTokens: fulltextTokens(selected),
  exactTokens: exactTokens(selected),
  scopedColumnKeys: scopedColumnKeys(selected),
})
