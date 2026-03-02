export enum DateReference {
  Last = 'last',
  Next = 'next',
}

export type DateReferenceValue = `${DateReference}`

export const isDateReferenceLast = (value: unknown): value is DateReferenceValue =>
  value === DateReference.Last

export const isDateReferenceNext = (value: unknown): value is DateReferenceValue =>
  value === DateReference.Next

export const isDateReference = (value: unknown): value is DateReferenceValue =>
  isDateReferenceLast(value) || isDateReferenceNext(value)
