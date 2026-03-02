import type { DateReference, SearchDirection } from './internal'
import { DateRelation } from './date-relation'

export interface RelativeDateQuery {
  direction: SearchDirection
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
      const direction = String(fullMatch[1]).toLowerCase() as SearchDirection
      const reference = (String(fullMatch[2] || '').toLowerCase() as DateReference | '') || null
      const weekdayPart = String(fullMatch[3] || '').trim().toLowerCase()

      if (!weekdayPart) {
        return null
      }

      return { direction, reference, weekdayPart, needle: normalizedNeedle }
    }

    const shortMatch = normalizedNeedle.match(/^(last|next)\s+(.+)$/i)
    if (!shortMatch) {
      return null
    }

    const reference = String(shortMatch[1]).toLowerCase() as DateReference
    const weekdayPart = String(shortMatch[2] || '').trim().toLowerCase()

    if (!weekdayPart) {
      return null
    }

    return {
      direction: DateRelation.On as SearchDirection,
      reference,
      weekdayPart,
      needle: normalizedNeedle,
    }
  }
}

export const relativeDateQueryParser = new RelativeDateQueryParser()
