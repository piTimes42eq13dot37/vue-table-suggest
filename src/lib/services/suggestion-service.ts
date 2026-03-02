import {
  formatDate,
  getAnchorWeekdayDate,
  getLocalizedWeekdaysMondayFirst,
  parseDateInput,
} from '../date'
import type {
  RankedSearchToken,
  SearchAnchor,
  SearchDirection,
  SearchToken,
} from '../models/internal'
import type { SearchModelDefinition } from '../models/external'
import { resolveEnglishLocale } from './highlight-service'
import { filterItems } from './filter-service'
import {
  formatGroupedNumber,
  normalizeNumberLike,
  readValue,
  readValueByKey,
} from './value-service'

const MIN_QUERY_LENGTH = 1
const SCORE_START = 300
const SCORE_MIDDLE = 200
const SCORE_END = 100
const WORD_SCORE_BASE = 10_000
const WORD_INDEX_WEIGHT = 1_000
const SCORE_CATEGORY_MATCH = 40
const SCORE_EXACT_MATCH = 50
const MAX_LENGTH_PENALTY = 30
const LENGTH_PENALTY_DIVISOR = 6
const TOP_SCORE_FIRST_COUNT = 3

const makeUid = (prefix: string, value: string): string => `${prefix}|${value}`

const isNumberLikeColumn = (column: { valueType?: string }): boolean =>
  column.valueType === 'number-like'

const escapeRegExp = (value: string): string =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const parseRelativeQuery = (rawInput: string) => {
  const needle = rawInput.trim().toLowerCase()
  if (!needle) {
    return null
  }

  const normalizedNeedle = needle.startsWith('date ') ? needle.slice(5).trim() : needle

  const fullMatch = normalizedNeedle.match(/^(before|after|on)(?:\s+(last|next))?\s+(.+)$/i)
  if (fullMatch) {
    const direction = String(fullMatch[1]).toLowerCase() as SearchDirection
    const anchor = (String(fullMatch[2] || '').toLowerCase() as SearchAnchor | '') || null
    const weekdayPart = String(fullMatch[3] || '').trim().toLowerCase()
    if (!weekdayPart) {
      return null
    }
    return { direction, anchor, weekdayPart, needle: normalizedNeedle }
  }

  const shortMatch = normalizedNeedle.match(/^(last|next)\s+(.+)$/i)
  if (shortMatch) {
    const anchor = String(shortMatch[1]).toLowerCase() as SearchAnchor
    const weekdayPart = String(shortMatch[2] || '').trim().toLowerCase()
    if (!weekdayPart) {
      return null
    }
    return { direction: 'on' as SearchDirection, anchor, weekdayPart, needle: normalizedNeedle }
  }

  return null
}

const buildRelativeTitlePrefix = (
  direction: SearchDirection,
  anchor: SearchAnchor,
): string => {
  if (direction === 'before') {
    return anchor === 'last' ? 'before last' : 'before next'
  }

  if (direction === 'after') {
    return anchor === 'last' ? 'after last' : 'after next'
  }

  return anchor === 'last' ? 'on last' : 'on next'
}

const getRelativeCategory = (direction: SearchDirection): string => {
  if (direction === 'before') {
    return 'date before'
  }

  if (direction === 'after') {
    return 'date after'
  }

  return 'date exact'
}

const getRelativeCandidates = <TItem>(
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] => {
  if (String(rawInput || '').trim().length < 4 ||
  selected.some((value) => value.type === 'date_relative')
) {
    return []
  }


  const parsed = parseRelativeQuery(rawInput)
  if (!parsed) {
    return []
  }

  const locale = annotations.locale ?? resolveEnglishLocale()
  const weekdays = getLocalizedWeekdaysMondayFirst(locale)
    .map((weekday, weekdayIndexMonday) => ({
      weekday,
      weekdayIndexMonday,
      weekdayLower: weekday.toLowerCase(),
    }))
    .filter((entry) => entry.weekdayLower.startsWith(parsed.weekdayPart))

  const anchorModes: SearchAnchor[] = parsed.anchor
    ? [parsed.anchor]
    : ['last', 'next']

  const orderedWeekdays = weekdays.slice()

  const results: SearchToken[] = []
  const seen = new Set<string>()

  orderedWeekdays.forEach((entry) => {
    anchorModes.forEach((anchor) => {
      const target = getAnchorWeekdayDate(anchor, entry.weekdayIndexMonday)
      const dateText = formatDate(target)
      const titlePrefix = buildRelativeTitlePrefix(parsed.direction, anchor)

      const title = `${titlePrefix} ${entry.weekday}`
      if (seen.has(title)) {
        return
      }

      seen.add(title)

      results.push({
        uid: `date_relative|${parsed.direction}|${anchor}|${entry.weekdayIndexMonday}|${dateText}`,
        type: 'date_relative',
        title,
        rawTitle: dateText,
        category: getRelativeCategory(parsed.direction),
        icon: 'event_repeat',
        direction: parsed.direction,
        anchor,
      })
    })
  })

  const getPriority = (title: string): number => {
    const normalized = title.toLowerCase()
    if (normalized === parsed.needle) {
      return 3
    }

    if (normalized.startsWith(parsed.needle)) {
      return 2
    }

    if (normalized.includes(parsed.needle)) {
      return 1
    }

    return 0
  }

  return results
    .sort((a, b) => {
      const diff = getPriority(b.title) - getPriority(a.title)
      return diff
    })
    .slice(0, annotations.maxWeekdaySuggestions ?? 4)
}

const getDateOperationCandidates = (
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] => {
  const parsedDate = parseDateInput(rawInput)
  if (!parsedDate) {
    return []
  }

  const selectedTypes = new Set(selected.map((token) => token.type))
  const dateText = formatDate(parsedDate)

  const defs = [
    { type: 'date_before', category: 'date before', icon: 'event_busy' },
    { type: 'date_after', category: 'date after', icon: 'event_available' },
    { type: 'date_exact', category: 'date exact', icon: 'event' },
  ]

  return defs
    .filter((def) => !selectedTypes.has(def.type))
    .map((def) => ({
      uid: `${def.type}|${dateText}`,
      type: def.type,
      title: dateText,
      rawTitle: dateText,
      category: def.category,
      icon: def.icon,
    }))
}

const getPositionWeight = (text: string, needle: string): number => {
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

const getBestWordMatchScore = (text: string, needle: string): number => {
  if (!needle) {
    return 0
  }

  const words = String(text || '')
    .split(/\s+/)
    .filter((word) => word.length > 0)

  let best = -1
  words.forEach((word, wordIndex) => {
    const locationScore = getPositionWeight(word, needle)
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

const scoreSuggestion = (title: string, category: string, needle: string): number => {
  if (!needle) {
    return 1
  }

  const normalizedTitle = String(title || '').toLowerCase()
  const wordMatchScore = getBestWordMatchScore(normalizedTitle, needle)
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

const countTermOccurrencesInValue = (value: string, term: string): number => {
  const source = String(value ?? '').toLowerCase()
  if (!source || !term) {
    return 0
  }

  const numeric = normalizeNumberLike(term)
  const isDigitsOnly = numeric.length > 0 && numeric === String(term)
  const pattern = isDigitsOnly
    ? numeric
        .split('')
        .map((digit) => escapeRegExp(digit))
        .join('[^0-9]*')
    : escapeRegExp(String(term))

  const regex = new RegExp(pattern, 'gi')
  const matches = source.match(regex)
  return matches ? matches.length : 0
}

const countColumnMatchesForTerms = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  columnKey: string,
  fulltextTerms: string[],
): number => {
  if (!fulltextTerms.length) {
    return 0
  }

  const searchKeys = [columnKey]

  return items.reduce((totalCount, item) => {
    const rowCount = fulltextTerms.reduce((termTotal, term) => {
      const occurrencesForTerm = searchKeys.reduce((keyTotal, key) => {
        return keyTotal + countTermOccurrencesInValue(readValueByKey(item, annotations, key), term)
      }, 0)

      return termTotal + occurrencesForTerm
    }, 0)

    return totalCount + rowCount
  }, 0)
}

const buildNormalCandidates = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  needle: string,
): SearchToken[] => {
  const selectedTypes = new Set(
    selected
      .map((token) => token.type)
      .filter((tokenType) => tokenType && !['fulltext', 'scope'].includes(tokenType)),
  )

  const candidates: RankedSearchToken[] = []
  const seen = new Set<string>()
  const baseRows = filterItems(items, annotations, selected)

  annotations.columns
    .filter((column) => column.suggestionEnabled !== false)
    .forEach((column) => {
      if (selectedTypes.has(column.key)) return

      new Set(baseRows.map((item) => readValue(item, column))).forEach((value) => {
        const rawTitle = String(value ?? '')
        if (!rawTitle) return

        const uid = makeUid(column.key, rawTitle)
        if (seen.has(uid)) return
        seen.add(uid)

        const displayTitle = isNumberLikeColumn(column) ? formatGroupedNumber(rawTitle) : rawTitle
        const scoreTitle = isNumberLikeColumn(column) ? rawTitle : displayTitle
        const score = scoreSuggestion(scoreTitle, column.label, needle)
        if (score < 0 && needle.length > 0) return

        candidates.push({
          uid,
          type: column.key,
          key: column.key,
          title: displayTitle,
          rawTitle,
          category: column.label,
          icon: column.icon,
          _score: score,
          _columnType: column.key,
        })
      })
    })

  const sortByScoreThenTitle = (a: RankedSearchToken, b: RankedSearchToken): number => {
    if (b._score !== a._score) {
      return b._score - a._score
    }

    return a.title.localeCompare(b.title)
  }

  const sorted = candidates.slice().sort(sortByScoreThenTitle)
  const result: RankedSearchToken[] = []
  const usedUids = new Set<string>()
  const usedTypes = new Set<string>()

  sorted.slice(0, TOP_SCORE_FIRST_COUNT).forEach((candidate) => {
    if (usedUids.has(candidate.uid)) {
      return
    }

    usedUids.add(candidate.uid)
    usedTypes.add(candidate._columnType)
    result.push(candidate)
  })

  const tail = sorted.slice(TOP_SCORE_FIRST_COUNT)

  tail.forEach((candidate) => {
    if (usedUids.has(candidate.uid) || usedTypes.has(candidate._columnType)) {
      return
    }

    usedUids.add(candidate.uid)
    usedTypes.add(candidate._columnType)
    result.push(candidate)
  })

  tail.forEach((candidate) => {
    if (usedUids.has(candidate.uid)) {
      return
    }

    usedUids.add(candidate.uid)
    result.push(candidate)
  })

  return result.map((candidate) => {
    const token = { ...candidate }
    delete (token as Partial<RankedSearchToken>)._score
    delete (token as Partial<RankedSearchToken>)._columnType
    return token as SearchToken
  })
}

const buildScopeCandidates = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  needle: string,
): SearchToken[] => {
  const fulltextTerms = selected
    .filter((token) => token.type === 'fulltext')
    .map((token) => String(token.title || '').toLowerCase())
    .filter((term) => term.length > 0)

  const exactOnly = selected.filter((token) => !['fulltext', 'scope'].includes(token.type))
  const baseRows = filterItems(items, annotations, exactOnly)

  const selectedScope = new Set(
    selected.filter((token) => token.type === 'scope' && token.key).map((token) => token.key),
  )

  const scoped = annotations.columns
    .filter((column) => column.searchable !== false)
    .filter((column) => !selectedScope.has(column.key))
    .map((column) => {
      const matchCount = countColumnMatchesForTerms(baseRows, annotations, column.key, fulltextTerms)
      const score = needle.length === 0 ? 1 : scoreSuggestion(column.label, 'Fulltext scope', needle)

      return {
        uid: `scope|${column.key}`,
        type: 'scope' as const,
        key: column.key,
        title: column.label,
        category: 'Fulltext scope',
        icon: column.icon,
        matchCount,
        _score: score,
      }
    })
    .filter((token) => token.matchCount > 0)
    .filter((token) => needle.length === 0 || token._score >= 0)
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount
      if (b._score !== a._score) return b._score - a._score
      return a.title.localeCompare(b.title)
    })

  return scoped.map((candidate) => {
    const token = { ...candidate }
    delete (token as { _score?: number })._score
    return token as SearchToken
  })
}

const mergeByUid = (...lists: SearchToken[][]): SearchToken[] => {
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

export const buildSuggestions = <TItem>(
  items: TItem[],
  annotations: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] => {
  const needle = String(rawInput || '').trim().toLowerCase()
  const maxSuggestions = annotations.maxSuggestions ?? 7

  const dateOps = getDateOperationCandidates(selected, rawInput)
  const relative = getRelativeCandidates(annotations, selected, rawInput)

  const fulltextActive = selected.some((token) => token.type === 'fulltext')

  if (fulltextActive) {
    const scopeCandidates = buildScopeCandidates(items, annotations, selected, needle)
    const normalCandidates = buildNormalCandidates(items, annotations, selected, needle)
    return mergeByUid(dateOps, relative, scopeCandidates, normalCandidates).slice(0, maxSuggestions)
  }

  if (dateOps.length > 0 || relative.length > 0) {
    return mergeByUid(dateOps, relative).slice(0, maxSuggestions)
  }

  if (needle.length < MIN_QUERY_LENGTH) {
    return []
  }

  return buildNormalCandidates(items, annotations, selected, needle).slice(0, maxSuggestions)
}
