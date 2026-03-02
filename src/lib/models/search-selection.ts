import type { ParsedSearchSelectionState } from './internal'
import type { SearchToken } from './internal'
import {
  isSearchDirectionAfter,
  isSearchDirectionBefore,
  isSearchDirectionOn,
} from './search-direction'
import { SearchTokenTypeValueObject } from './search-token-type'

export class SearchSelection {
  private readonly selected: SearchToken[]

  private readonly fulltext: SearchToken[]

  private readonly exact: SearchToken[]

  private readonly scopedKeys: string[]

  private constructor(selected: SearchToken[]) {
    this.selected = selected
    this.fulltext = this.selected.filter((token) => SearchTokenTypeValueObject.isFulltext(token.type))
    this.exact = this.selected.filter((token) => SearchTokenTypeValueObject.isExactFilterType(token.type))
    this.scopedKeys = this.selected
      .filter((token) => SearchTokenTypeValueObject.isScope(token.type) && token.key)
      .map((token) => token.key!)
  }

  static from(selected: SearchToken[]): SearchSelection {
    return new SearchSelection(selected)
  }

  static isExactTokenType(tokenType: string): boolean {
    return SearchTokenTypeValueObject.isExactFilterType(tokenType)
  }

  static isDateToken(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isDate(token.type)
  }

  static isFulltextToken(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isFulltext(token.type)
  }

  static isScopeToken(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isScope(token.type)
  }

  static isRelativeDateToken(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isDateRelative(token.type)
  }

  static isExactFilterToken(token: SearchToken): boolean {
    return SearchSelection.isExactTokenType(token.type)
  }

  static resolveTermKey(token: SearchToken): string {
    return token.key ?? (SearchTokenTypeValueObject.isDate(token.type) ? 'date' : token.type)
  }

  static isBeforeDirection(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isDateBefore(token.type) || isSearchDirectionBefore(token.direction)
  }

  static isAfterDirection(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isDateAfter(token.type) || isSearchDirectionAfter(token.direction)
  }

  static isOnDirection(token: SearchToken): boolean {
    return SearchTokenTypeValueObject.isDateExact(token.type) || isSearchDirectionOn(token.direction)
  }

  get fullTextTokens(): SearchToken[] {
    return this.fulltext
  }

  get exactTokens(): SearchToken[] {
    return this.exact
  }

  get scopedColumnKeys(): string[] {
    return this.scopedKeys
  }

  toParsedState(): ParsedSearchSelectionState {
    return {
      fullTextTokens: this.fullTextTokens,
      exactTokens: this.exactTokens,
      scopedColumnKeys: this.scopedColumnKeys,
    }
  }

  isDateToken(token: SearchToken): boolean {
    return SearchSelection.isDateToken(token)
  }

  resolveTermKey(token: SearchToken): string {
    return SearchSelection.resolveTermKey(token)
  }
}
