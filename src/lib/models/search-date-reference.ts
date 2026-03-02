import {
  DateReference as DateReferenceEnum,
  isDateReference,
  isDateReferenceLast,
  isDateReferenceNext,
} from './date-reference'

export type DateReference = `${DateReferenceEnum}`

export class DateReferenceValueObject {
  static readonly last: DateReference = DateReferenceEnum.Last

  static readonly next: DateReference = DateReferenceEnum.Next

  static isLast(value: unknown): value is DateReference {
    return isDateReferenceLast(value)
  }

  static isNext(value: unknown): value is DateReference {
    return isDateReferenceNext(value)
  }

  static isValid(value: unknown): value is DateReference {
    return isDateReference(value)
  }
}
