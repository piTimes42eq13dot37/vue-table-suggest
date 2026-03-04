export enum DateReference {
  Last = 'last',
  Next = 'next',
}

export const isDateReferenceLast = (value: string): value is DateReference =>
  value === DateReference.Last

export const isDateReferenceNext = (value: string): value is DateReference =>
  value === DateReference.Next

export const isDateReference = (value: string): value is DateReference =>
  isDateReferenceLast(value) || isDateReferenceNext(value)
