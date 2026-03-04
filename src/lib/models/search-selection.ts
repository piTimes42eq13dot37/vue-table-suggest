import type { ParsedSearchSelectionState } from './internal'
import type { SearchToken as SearchTokenData } from './internal'
import { SearchTokenModel } from './search-token'

export class SearchSelection {
  private readonly selected: SearchTokenData[]

  private readonly fulltext: SearchTokenData[]

  private readonly exact: SearchTokenData[]

  private readonly scopedKeys: string[]

  private constructor(selected: SearchTokenData[]) {
    this.selected = selected
    this.fulltext = this.selected.filter((token) => SearchTokenModel.isFulltext(token))
    this.exact = this.selected.filter((token) => SearchTokenModel.isExactCellValue(token))
    this.scopedKeys = this.selected
      .filter((token) => SearchTokenModel.isScope(token))
      .map((token) => token.key)
  }

  static from(selected: SearchTokenData[]): SearchSelection {
    return new SearchSelection(selected)
  }

  get fulltextTokens(): SearchTokenData[] {
    return this.fulltext
  }

  get exactTokens(): SearchTokenData[] {
    return this.exact
  }

  get scopedColumnKeys(): string[] {
    return this.scopedKeys
  }

  toParsedState(): ParsedSearchSelectionState {
    return {
      fulltextTokens: this.fulltextTokens,
      exactTokens: this.exactTokens,
      scopedColumnKeys: this.scopedColumnKeys,
    }
  }
}
