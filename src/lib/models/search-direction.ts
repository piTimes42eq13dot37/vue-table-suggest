import {
  DateRelation,
  isDateRelation,
  isDateRelationAfter,
  isDateRelationBefore,
  isDateRelationOn,
} from './date-relation'

export type SearchDirection = `${DateRelation}`

export const isSearchDirectionBefore = isDateRelationBefore

export const isSearchDirectionAfter = isDateRelationAfter

export const isSearchDirectionOn = isDateRelationOn

export const isSearchDirection = isDateRelation
