import type { DateReference } from './date-reference'
import type { DateRelation } from './date-relation'
import {
  isDateRelationAfter,
  isDateRelationBefore,
  isDateRelationOn,
} from './date-relation'

const builtInSearchTokenType = {
  fulltext: 'fulltext',
  scope: 'scope',
  dateBefore: 'date_before',
  dateAfter: 'date_after',
  dateExact: 'date_exact',
  dateRelative: 'date_relative',
} as const

const dateOperationTypes = [
  builtInSearchTokenType.dateBefore,
  builtInSearchTokenType.dateAfter,
  builtInSearchTokenType.dateExact,
] as const

export type BuiltInSearchTokenType =
  (typeof builtInSearchTokenType)[keyof typeof builtInSearchTokenType]

export type SearchTokenType = BuiltInSearchTokenType | string

export type DateOperationTokenType =
  (typeof dateOperationTypes)[number]

interface TokenBase {
  uid: string
  title: string
}

export interface DateOperationToken extends TokenBase {
  type: DateOperationTokenType
  rawTitle: string
}

export interface DateRelativeToken extends TokenBase {
  type: typeof builtInSearchTokenType.dateRelative
  rawTitle: string
  dateRelation: DateRelation
  reference: DateReference
}

export interface FulltextToken extends TokenBase {
  type: typeof builtInSearchTokenType.fulltext
}

export interface FulltextColumnScopeToken extends TokenBase {
  type: typeof builtInSearchTokenType.scope
  key: string
  matchCount?: number
  icon?: string
}

export interface ExactCellValueToken extends TokenBase {
  type: SearchTokenType
  key?: string
  icon?: string
}

export type DateSearchToken = DateOperationToken | DateRelativeToken

export type SearchToken =
  | DateOperationToken
  | DateRelativeToken
  | FulltextToken
  | FulltextColumnScopeToken
  | ExactCellValueToken

type BuiltInToken = DateSearchToken | FulltextToken | FulltextColumnScopeToken

const isFulltextType = (value: string): value is typeof builtInSearchTokenType.fulltext =>
  value === builtInSearchTokenType.fulltext

const isScopeType = (value: string): value is typeof builtInSearchTokenType.scope =>
  value === builtInSearchTokenType.scope

const isDateBeforeType = (value: string): value is typeof builtInSearchTokenType.dateBefore =>
  value === builtInSearchTokenType.dateBefore

const isDateAfterType = (value: string): value is typeof builtInSearchTokenType.dateAfter =>
  value === builtInSearchTokenType.dateAfter

const isDateExactType = (value: string): value is typeof builtInSearchTokenType.dateExact =>
  value === builtInSearchTokenType.dateExact

const isDateRelativeType = (value: string): value is typeof builtInSearchTokenType.dateRelative =>
  value === builtInSearchTokenType.dateRelative

const isDateType = (value: string): value is Exclude<BuiltInSearchTokenType, 'fulltext' | 'scope'> =>
  isDateBeforeType(value) ||
  isDateAfterType(value) ||
  isDateExactType(value) ||
  isDateRelativeType(value)

const isBuiltInType = (value: string): value is BuiltInSearchTokenType =>
  isFulltextType(value) || isScopeType(value) || isDateType(value)

const isExactCellValueType = (value: string): boolean =>
  !isFulltextType(value) && !isScopeType(value)

const isFulltext = (token: SearchToken): token is FulltextToken =>
  isFulltextType(token.type)

const isScope = (token: SearchToken): token is FulltextColumnScopeToken =>
  isScopeType(token.type)

const isDateBefore = (token: SearchToken): token is DateOperationToken =>
  isDateBeforeType(token.type)

const isDateAfter = (token: SearchToken): token is DateOperationToken =>
  isDateAfterType(token.type)

const isDateExact = (token: SearchToken): token is DateOperationToken =>
  isDateExactType(token.type)

const isDateRelative = (token: SearchToken): token is DateRelativeToken =>
  isDateRelativeType(token.type)

const isDate = (token: SearchToken): token is DateSearchToken =>
  isDateType(token.type)

const isBuiltIn = (token: SearchToken): token is BuiltInToken =>
  isBuiltInType(token.type)

const isExactCellValue = (token: SearchToken): token is ExactCellValueToken =>
  isExactCellValueType(token.type)

const isBeforeDirection = (token: SearchToken): boolean =>
  isDateBefore(token) ||
  (isDateRelative(token) && isDateRelationBefore(token.dateRelation))

const isAfterDirection = (token: SearchToken): boolean =>
  isDateAfter(token) ||
  (isDateRelative(token) && isDateRelationAfter(token.dateRelation))

const isOnDirection = (token: SearchToken): boolean =>
  isDateExact(token) ||
  (isDateRelative(token) && isDateRelationOn(token.dateRelation))

const resolveTermKey = (token: SearchToken): string => {
  if (isDate(token)) {
    return 'date'
  }

  if (isScope(token)) {
    return token.key
  }

  if (isExactCellValue(token) && token.key) {
    return token.key
  }

  return token.type
}

export const SearchTokenModel = {
  fulltext: builtInSearchTokenType.fulltext,
  scope: builtInSearchTokenType.scope,
  dateBefore: builtInSearchTokenType.dateBefore,
  dateAfter: builtInSearchTokenType.dateAfter,
  dateExact: builtInSearchTokenType.dateExact,
  dateRelative: builtInSearchTokenType.dateRelative,
  dateOperationTypes,
  isFulltextType,
  isScopeType,
  isDateBeforeType,
  isDateAfterType,
  isDateExactType,
  isDateRelativeType,
  isDateType,
  isBuiltInType,
  isExactCellValueType,
  isFulltext,
  isScope,
  isDateBefore,
  isDateAfter,
  isDateExact,
  isDateRelative,
  isDate,
  isBuiltIn,
  isExactCellValue,
  isBeforeDirection,
  isAfterDirection,
  isOnDirection,
  resolveTermKey,
}
