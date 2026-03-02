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

export interface RelativeDateSuggestionPolicyConfig {
  minQueryLength: number
  defaultMaxWeekdaySuggestions: number
}

export interface TextSuggestionScoringPolicyConfig {
  scoreStart: number
  scoreMiddle: number
  scoreEnd: number
  wordScoreBase: number
  wordIndexWeight: number
  scoreCategoryMatch: number
  scoreExactMatch: number
  maxLengthPenalty: number
  lengthPenaltyDivisor: number
}

export interface SuggestionPolicyConfig {
  relativeDate: RelativeDateSuggestionPolicyConfig
  textScoring: TextSuggestionScoringPolicyConfig
}

export const defaultSuggestionPolicyConfig: SuggestionPolicyConfig = {
  relativeDate: {
    minQueryLength: 4,
    defaultMaxWeekdaySuggestions: 4,
  },
  textScoring: {
    scoreStart: 300,
    scoreMiddle: 200,
    scoreEnd: 100,
    wordScoreBase: 10_000,
    wordIndexWeight: 1_000,
    scoreCategoryMatch: 40,
    scoreExactMatch: 50,
    maxLengthPenalty: 30,
    lengthPenaltyDivisor: 6,
  },
}

const mergeSuggestionPolicyConfig = (
  overrides?: Partial<SuggestionPolicyConfig>,
): SuggestionPolicyConfig => ({
  relativeDate: {
    ...defaultSuggestionPolicyConfig.relativeDate,
    ...(overrides?.relativeDate ?? {}),
  },
  textScoring: {
    ...defaultSuggestionPolicyConfig.textScoring,
    ...(overrides?.textScoring ?? {}),
  },
})

class RelativeDateSuggestionPolicy {
  constructor(private readonly config: RelativeDateSuggestionPolicyConfig) {
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
      String(rawInput || '').trim().length < this.config.minQueryLength ||
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
      .slice(0, modelDefinition.maxWeekdaySuggestions ?? this.config.defaultMaxWeekdaySuggestions)
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
  constructor(private readonly config: TextSuggestionScoringPolicyConfig) {
  }

  private getPositionWeight(text: string, needle: string): number {
    if (!needle) {
      return 0
    }

    const index = text.indexOf(needle)
    if (index < 0) {
      return -1
    }

    if (index === 0) {
      return this.config.scoreStart
    }

    if (index + needle.length === text.length) {
      return this.config.scoreEnd
    }

    return this.config.scoreMiddle
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

      const score = this.config.wordScoreBase - wordIndex * this.config.wordIndexWeight + locationScore
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
    const categoryScore = normalizedCategory.includes(needle) ? this.config.scoreCategoryMatch : 0
    const exactBonus = normalizedTitle === needle ? this.config.scoreExactMatch : 0
    const lengthPenalty = Math.min(
      this.config.maxLengthPenalty,
      Math.floor(normalizedTitle.length / this.config.lengthPenaltyDivisor),
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

export interface SuggestionPolicies {
  relativeDateSuggestionPolicy: RelativeDateSuggestionPolicy
  dateOperationSuggestionPolicy: DateOperationSuggestionPolicy
  textSuggestionScoringPolicy: TextSuggestionScoringPolicy
  uniqueSuggestionMergeService: UniqueSuggestionMergeService
}

export const createSuggestionPolicies = (
  overrides?: Partial<SuggestionPolicyConfig>,
): SuggestionPolicies => {
  const config = mergeSuggestionPolicyConfig(overrides)

  return {
    relativeDateSuggestionPolicy: new RelativeDateSuggestionPolicy(config.relativeDate),
    dateOperationSuggestionPolicy: new DateOperationSuggestionPolicy(),
    textSuggestionScoringPolicy: new TextSuggestionScoringPolicy(config.textScoring),
    uniqueSuggestionMergeService: new UniqueSuggestionMergeService(),
  }
}

const defaultSuggestionPolicies = createSuggestionPolicies()

export const relativeDateSuggestionPolicy = defaultSuggestionPolicies.relativeDateSuggestionPolicy

export const dateOperationSuggestionPolicy = defaultSuggestionPolicies.dateOperationSuggestionPolicy

export const textSuggestionScoringPolicy = defaultSuggestionPolicies.textSuggestionScoringPolicy

export const uniqueSuggestionMergeService = defaultSuggestionPolicies.uniqueSuggestionMergeService
