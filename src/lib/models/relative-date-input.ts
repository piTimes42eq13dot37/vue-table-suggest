import type { DateReferenceValue } from './date-reference'
import type { DateRelationValue } from './date-relation'

export interface RelativeDateInput {
  relation: DateRelationValue
  reference: DateReferenceValue
  weekdayIndexMonday: number
  weekday: string
}
