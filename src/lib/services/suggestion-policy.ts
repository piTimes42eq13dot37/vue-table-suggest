import { dateDomainService } from './date-service'
import type {
  DateReference as DateReference,
  SearchDirection,
  SearchToken,
} from '../models/internal'
import type { SearchModelDefinition } from '../models/external'
import { relativeDateQueryParser } from '../models/relative-date-query-parser'
import { SearchTokenFactory } from '../models/search-token-factory'
import { SearchSelection } from '../models/search-selection'
import {
  isSearchDirectionAfter,
  isSearchDirectionBefore,
} from '../models/search-direction'
import { SearchTokenTypeValueObject } from '../models/search-token-type'
import { resolveEnglishLocale } from './highlight-service'

const SCORE_START = 300
const SCORE_MIDDLE = 200
const SCORE_END = 100
const WORD_SCORE_BASE = 10_000
const WORD_INDEX_WEIGHT = 1_000
const SCORE_CATEGORY_MATCH = 40
const SCORE_EXACT_MATCH = 50
const MAX_LENGTH_PENALTY = 30
const LENGTH_PENALTY_DIVISOR = 6

class RelativeDateSuggestionPolicy {
  private readonly minQueryLength: number

  private readonly defaultMaxWeekdaySuggestions: number

  constructor(minQueryLength = 4, defaultMaxWeekdaySuggestions = 4) {
    this.minQueryLength = minQueryLength
    this.defaultMaxWeekdaySuggestions = defaultMaxWeekdaySuggestions
  }

  private buildRelativeTitlePrefix(direction: SearchDirection, reference: DateReference): string {
    if (isSearchDirectionBefore(direction)) {
      if (reference === 'last') {
        return 'before last'
      }

      return 'before next'
    }

    if (isSearchDirectionAfter(direction)) {
      if (reference === 'last') {
        return 'after last'
      }

      return 'after next'
    }

    if (reference === 'last') {
      return 'on last'
    }

    return 'on next'
  }

  private getPriority(title: string, needle: string): number {
    const normalized = title.toLowerCase()

    if (normalized === needle) {
      return 3
    }

    if (normalized.startsWith(needle)) {
      return 2
    }

    if (normalized.includes(needle)) {
      return 1
    }

    return 0
  }

  suggest<TItem>(
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    if (
      String(rawInput || '').trim().length < this.minQueryLength ||
      selected.some((token) => SearchSelection.isRelativeDateToken(token))
    ) {
      return []
    }

    const parsed = relativeDateQueryParser.parse(rawInput)
    if (!parsed) {
      return []
    }

    const locale = modelDefinition.locale ?? resolveEnglishLocale()
    const weekdays = dateDomainService.getLocalizedWeekdaysMondayFirst(locale)
      .map((weekday, weekdayIndexMonday) => ({
        weekday,
        weekdayIndexMonday,
        weekdayLower: weekday.toLowerCase(),
      }))
      .filter((entry) => entry.weekdayLower.startsWith(parsed.weekdayPart))

    const referenceModes: DateReference[] = parsed.reference ? [parsed.reference] : ['last', 'next']
    const results: SearchToken[] = []
    const seen = new Set<string>()

    weekdays.forEach((entry) => {
      referenceModes.forEach((reference) => {
        const target = dateDomainService.getReferenceWeekdayDate(reference, entry.weekdayIndexMonday)
        const dateText = dateDomainService.formatDate(target)
        const titlePrefix = this.buildRelativeTitlePrefix(parsed.direction, reference)
        const title = `${titlePrefix} ${entry.weekday}`

        if (seen.has(title)) {
          return
        }

        seen.add(title)
        results.push(
          SearchTokenFactory.createDateRelative({
            direction: parsed.direction,
            reference,
            weekdayIndexMonday: entry.weekdayIndexMonday,
            dateText,
            title,
          }),
        )
      })
    })

    return results
      .sort((a, b) => this.getPriority(b.title, parsed.needle) - this.getPriority(a.title, parsed.needle))
      .slice(0, modelDefinition.maxWeekdaySuggestions ?? this.defaultMaxWeekdaySuggestions)
  }
}

class DateOperationSuggestionPolicy {
  suggest(selected: SearchToken[], rawInput: string): SearchToken[] {
    const parsedDate = dateDomainService.parseDateInput(rawInput)
    if (!parsedDate) {
      return []
    }

    const selectedTypes = new Set(selected.map((token) => token.type))
    const dateText = dateDomainService.formatDate(parsedDate)

    const defs = [
      SearchTokenTypeValueObject.dateBefore,
      SearchTokenTypeValueObject.dateAfter,
      SearchTokenTypeValueObject.dateExact,
    ]

    return defs
      .filter((type) => !selectedTypes.has(type))
      .map((type) => SearchTokenFactory.createDateOperation(type, dateText))
  }
}

class TextSuggestionScoringPolicy {
  private getPositionWeight(text: string, needle: string): number {
    if (!needle) {
      return 0
    }

    const index = text.indexOf(needle)
    if (index < 0) {
      return -1
    }

    if (index === 0) {
      return SCORE_START
    }

    if (index + needle.length === text.length) {
      return SCORE_END
    }

    return SCORE_MIDDLE
  }

  private getBestWordMatchScore(text: string, needle: string): number {
    if (!needle) {
      return 0
    }

    const words = String(text || '')
      .split(/\s+/)
      .filter((word) => word.length > 0)

    let best = -1
    words.forEach((word, wordIndex) => {
      const locationScore = this.getPositionWeight(word, needle)
      if (locationScore < 0) {
        return
      }

      const score = WORD_SCORE_BASE - wordIndex * WORD_INDEX_WEIGHT + locationScore
      if (score > best) {
        best = score
      }
    })

    return best
  }

  score(title: string, category: string, needle: string): number {
    if (!needle) {
      return 1
    }

    const normalizedTitle = String(title || '').toLowerCase()
    const wordMatchScore = this.getBestWordMatchScore(normalizedTitle, needle)

    if (wordMatchScore < 0) {
      return -1
    }

    const normalizedCategory = String(category || '').toLowerCase()
    const categoryScore = normalizedCategory.includes(needle) ? SCORE_CATEGORY_MATCH : 0
    const exactBonus = normalizedTitle === needle ? SCORE_EXACT_MATCH : 0
    const lengthPenalty = Math.min(
      MAX_LENGTH_PENALTY,
      Math.floor(normalizedTitle.length / LENGTH_PENALTY_DIVISOR),
    )

    return wordMatchScore + categoryScore + exactBonus - lengthPenalty
  }
}

class UniqueSuggestionMergeService {
  merge(...lists: SearchToken[][]): SearchToken[] {
    const merged: SearchToken[] = []
    const seen = new Set<string>()

    lists.flat().forEach((token) => {
      if (seen.has(token.uid)) {
        return
      }

      seen.add(token.uid)
      merged.push(token)
    })

    return merged
  }
}

export const relativeDateSuggestionPolicy = new RelativeDateSuggestionPolicy()

export const dateOperationSuggestionPolicy = new DateOperationSuggestionPolicy()

export const textSuggestionScoringPolicy = new TextSuggestionScoringPolicy()

export const uniqueSuggestionMergeService = new UniqueSuggestionMergeService()
