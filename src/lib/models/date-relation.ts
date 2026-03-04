export enum DateRelation {
  Before = 'before',
  After = 'after',
  On = 'on',
}

export const isDateRelationBefore = (value: string): value is DateRelation =>
  value === DateRelation.Before

export const isDateRelationAfter = (value: string): value is DateRelation =>
  value === DateRelation.After

export const isDateRelationOn = (value: string): value is DateRelation =>
  value === DateRelation.On

export const isDateRelation = (value: string): value is DateRelation =>
  isDateRelationBefore(value) || isDateRelationAfter(value) || isDateRelationOn(value)
