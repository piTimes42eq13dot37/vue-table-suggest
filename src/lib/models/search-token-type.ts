export type BuiltInSearchTokenType =
  | 'fulltext'
  | 'scope'
  | 'date_before'
  | 'date_after'
  | 'date_exact'
  | 'date_relative'

export type SearchTokenType = BuiltInSearchTokenType | string

export class SearchTokenTypeValueObject {
  static readonly fulltext: BuiltInSearchTokenType = 'fulltext'

  static readonly scope: BuiltInSearchTokenType = 'scope'

  static readonly dateBefore: BuiltInSearchTokenType = 'date_before'

  static readonly dateAfter: BuiltInSearchTokenType = 'date_after'

  static readonly dateExact: BuiltInSearchTokenType = 'date_exact'

  static readonly dateRelative: BuiltInSearchTokenType = 'date_relative'

  static isFulltext(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.fulltext
  }

  static isScope(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.scope
  }

  static isDateBefore(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.dateBefore
  }

  static isDateAfter(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.dateAfter
  }

  static isDateExact(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.dateExact
  }

  static isDateRelative(value: unknown): boolean {
    return value === SearchTokenTypeValueObject.dateRelative
  }

  static isDate(value: unknown): boolean {
    return (
      SearchTokenTypeValueObject.isDateBefore(value) ||
      SearchTokenTypeValueObject.isDateAfter(value) ||
      SearchTokenTypeValueObject.isDateExact(value) ||
      SearchTokenTypeValueObject.isDateRelative(value)
    )
  }

  static isBuiltIn(value: unknown): value is BuiltInSearchTokenType {
    return (
      SearchTokenTypeValueObject.isFulltext(value) ||
      SearchTokenTypeValueObject.isScope(value) ||
      SearchTokenTypeValueObject.isDate(value)
    )
  }

  static isExactFilterType(value: unknown): boolean {
    return !SearchTokenTypeValueObject.isFulltext(value) && !SearchTokenTypeValueObject.isScope(value)
  }
}
