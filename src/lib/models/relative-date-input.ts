import type { DateReference } from './date-reference'
import type { DateRelation } from './date-relation'

export interface RelativeDateInput {
  dateRelation: DateRelation
  reference: DateReference
  weekdayIndexMonday: number
  weekday: string
}
