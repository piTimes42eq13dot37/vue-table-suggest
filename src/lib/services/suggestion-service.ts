import type {
  RankedSearchToken,
  SearchToken,
} from '../models/internal'
import type { SearchModelDefinition } from '../models/external'
import {
  SearchSelection,
} from '../models/search-selection'
import { SearchTokenFactory } from '../models/search-token-factory'
import {
  dateOperationSuggestionPolicy,
  relativeDateSuggestionPolicy,
  textSuggestionScoringPolicy,
  uniqueSuggestionMergeService,
} from './suggestion-policy'
import { filterItems } from './filter-service'
import {
  formatGroupedNumber,
  normalizeNumberLike,
  readValue,
  readValueByKey,
} from './value-service'

const MIN_QUERY_LENGTH = 1
const TOP_SCORE_FIRST_COUNT = 3

interface SuggestionContext<TItem> {
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
  selected: SearchToken[]
  rawInput: string
  needle: string
}

type CandidateBuilder<TItem> = (context: SuggestionContext<TItem>) => SearchToken[]

const makeUid = (prefix: string, value: string): string => `${prefix}|${value}`

const isNumberLikeColumn = (column: { valueType?: string }): boolean =>
  column.valueType === 'number-like'

const escapeRegExp = (value: string): string =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

class SuggestionService {
  private getRelativeCandidates<TItem>(
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    return relativeDateSuggestionPolicy.suggest(modelDefinition, selected, rawInput)
  }

  private getDateOperationCandidates(
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    return dateOperationSuggestionPolicy.suggest(selected, rawInput)
  }

  private countTermOccurrencesInValue(value: string, term: string): number {
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

  private countColumnMatchesForTerms<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    columnKey: string,
    fulltextTerms: string[],
  ): number {
    if (!fulltextTerms.length) {
      return 0
    }

    const searchKeys = [columnKey]

    return items.reduce((totalCount, item) => {
      const rowCount = fulltextTerms.reduce((termTotal, term) => {
        const occurrencesForTerm = searchKeys.reduce((keyTotal, key) => {
          return keyTotal + this.countTermOccurrencesInValue(readValueByKey(item, modelDefinition, key), term)
        }, 0)

        return termTotal + occurrencesForTerm
      }, 0)

      return totalCount + rowCount
    }, 0)
  }

  private buildNormalCandidates<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    needle: string,
  ): SearchToken[] {
    const selectedTypes = new Set(
      selected
        .map((token) => token.type)
        .filter((tokenType) => tokenType && SearchSelection.isExactTokenType(tokenType)),
    )

    const candidates: RankedSearchToken[] = []
    const seen = new Set<string>()
    const baseRows = filterItems(items, modelDefinition, selected)

    modelDefinition.columns
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
          const score = textSuggestionScoringPolicy.score(scoreTitle, column.label, needle)
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

  private buildScopeCandidates<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    needle: string,
  ): SearchToken[] {
    const fulltextTerms = selected
      .filter((token) => SearchSelection.isFulltextToken(token))
      .map((token) => String(token.title || '').toLowerCase())
      .filter((term) => term.length > 0)

    const exactOnly = selected.filter((token) => SearchSelection.isExactFilterToken(token))
    const baseRows = filterItems(items, modelDefinition, exactOnly)

    const selectedScope = new Set(
      selected
        .filter((token) => SearchSelection.isScopeToken(token) && token.key)
        .map((token) => token.key),
    )

    const scoped = modelDefinition.columns
      .filter((column) => column.searchable !== false)
      .filter((column) => !selectedScope.has(column.key))
      .map((column) => {
        const matchCount = this.countColumnMatchesForTerms(baseRows, modelDefinition, column.key, fulltextTerms)
        const score = needle.length === 0 ? 1 : textSuggestionScoringPolicy.score(column.label, 'Fulltext scope', needle)

        return {
          ...SearchTokenFactory.createScope({
            key: column.key,
            title: column.label,
            icon: column.icon,
          }),
          matchCount,
          _score: score,
        }
      })
      .filter((token) => (token.matchCount ?? 0) > 0)
      .filter((token) => needle.length === 0 || token._score >= 0)
      .sort((a, b) => {
        const aMatchCount = a.matchCount ?? 0
        const bMatchCount = b.matchCount ?? 0

        if (bMatchCount !== aMatchCount) return bMatchCount - aMatchCount
        if (b._score !== a._score) return b._score - a._score
        return a.title.localeCompare(b.title)
      })

    return scoped.map((candidate) => {
      const token = { ...candidate }
      delete (token as { _score?: number })._score
      return token as SearchToken
    })
  }

  private collectCandidates<TItem>(
    context: SuggestionContext<TItem>,
    builders: CandidateBuilder<TItem>[],
  ): SearchToken[] {
    const candidateLists = builders.map((builder) => builder(context))
    return uniqueSuggestionMergeService.merge(...candidateLists)
  }

  buildSuggestions<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchToken[],
    rawInput: string,
  ): SearchToken[] {
    const needle = String(rawInput || '').trim().toLowerCase()
    const maxSuggestions = modelDefinition.maxSuggestions ?? 7

    const context: SuggestionContext<TItem> = {
      items,
      modelDefinition,
      selected,
      rawInput,
      needle,
    }

    const buildDateOperationCandidatesFromContext = (innerContext: SuggestionContext<TItem>): SearchToken[] =>
      this.getDateOperationCandidates(innerContext.selected, innerContext.rawInput)

    const buildRelativeCandidatesFromContext = (innerContext: SuggestionContext<TItem>): SearchToken[] =>
      this.getRelativeCandidates(innerContext.modelDefinition, innerContext.selected, innerContext.rawInput)

    const buildScopeCandidatesFromContext = (innerContext: SuggestionContext<TItem>): SearchToken[] =>
      this.buildScopeCandidates(
        innerContext.items,
        innerContext.modelDefinition,
        innerContext.selected,
        innerContext.needle,
      )

    const buildNormalCandidatesFromContext = (innerContext: SuggestionContext<TItem>): SearchToken[] =>
      this.buildNormalCandidates(
        innerContext.items,
        innerContext.modelDefinition,
        innerContext.selected,
        innerContext.needle,
      )

    const dateAndRelative = this.collectCandidates(context, [
      buildDateOperationCandidatesFromContext,
      buildRelativeCandidatesFromContext,
    ])

    const fulltextActive = selected.some((token) => SearchSelection.isFulltextToken(token))

    if (fulltextActive) {
      return this.collectCandidates(context, [
        buildDateOperationCandidatesFromContext,
        buildRelativeCandidatesFromContext,
        buildScopeCandidatesFromContext,
        buildNormalCandidatesFromContext,
      ]).slice(0, maxSuggestions)
    }

    if (dateAndRelative.length > 0) {
      return dateAndRelative.slice(0, maxSuggestions)
    }

    if (needle.length < MIN_QUERY_LENGTH) {
      return []
    }

    return buildNormalCandidatesFromContext(context).slice(0, maxSuggestions)
  }
}

const suggestionService = new SuggestionService()

export const buildSuggestions = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchToken[],
  rawInput: string,
): SearchToken[] => suggestionService.buildSuggestions(items, modelDefinition, selected, rawInput)
