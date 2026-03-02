export enum DateRelation {
  Before = 'before',
  After = 'after',
  On = 'on',
}

export type DateRelationValue = `${DateRelation}`

export const isDateRelationBefore = (value: unknown): value is DateRelationValue =>
  value === DateRelation.Before

export const isDateRelationAfter = (value: unknown): value is DateRelationValue =>
  value === DateRelation.After

export const isDateRelationOn = (value: unknown): value is DateRelationValue =>
  value === DateRelation.On

export const isDateRelation = (value: unknown): value is DateRelationValue =>
  isDateRelationBefore(value) || isDateRelationAfter(value) || isDateRelationOn(value)
