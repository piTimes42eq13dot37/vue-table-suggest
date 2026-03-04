import type { DateReference } from './date-reference'
import { isDateReference } from './date-reference'
import { DateRelation, isDateRelation } from './date-relation'

export interface RelativeDateQuery {
  dateRelation: DateRelation
  reference: DateReference | null
  weekdayPart: string
  needle: string
}

class RelativeDateQueryParser {
  parse(rawInput: string): RelativeDateQuery | null {
    const needle = rawInput.trim().toLowerCase()
    if (!needle) {
      return null
    }

    const normalizedNeedle = needle.startsWith('date ') ? needle.slice(5).trim() : needle
    const fullMatch = normalizedNeedle.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i)

    if (fullMatch) {
      const dateRelationCandidate = String(fullMatch[1]).toLowerCase()
      if (!isDateRelation(dateRelationCandidate)) {
        return null
      }

      const referenceCandidate = String(fullMatch[2] || '').toLowerCase()
      const reference = referenceCandidate ? (isDateReference(referenceCandidate) ? referenceCandidate : null) : null
      const weekdayPart = String(fullMatch[3] || '').trim().toLowerCase()

      if (!weekdayPart) {
        return null
      }

      return { dateRelation: dateRelationCandidate, reference, weekdayPart, needle: normalizedNeedle }
    }

    const shortMatch = normalizedNeedle.match(/^(last|next)\s+(.+)$/i)
    if (!shortMatch) {
      return null
    }

    const referenceCandidate = String(shortMatch[1]).toLowerCase()
    if (!isDateReference(referenceCandidate)) {
      return null
    }

    const reference = referenceCandidate
    const weekdayPart = String(shortMatch[2] || '').trim().toLowerCase()

    if (!weekdayPart) {
      return null
    }

    return {
      dateRelation: DateRelation.On,
      reference,
      weekdayPart,
      needle: normalizedNeedle,
    }
  }
}

export const relativeDateQueryParser = new RelativeDateQueryParser()
