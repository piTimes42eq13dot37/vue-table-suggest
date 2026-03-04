import type {
  RankedSearchToken,
  SearchToken as SearchTokenData,
} from '../models/internal'
import type { SearchModelDefinition } from '../models/external'
import { SearchTokenModel } from '../models/search-token'
import { SearchTokenFactory } from '../models/search-token-factory'
import {
  createSuggestionPolicies,
  type SuggestionPolicies,
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

interface SuggestionServiceDependencies {
  policies: SuggestionPolicies
  filterItems: typeof filterItems
}

interface SuggestionContext<TItem> {
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
  selected: SearchTokenData[]
  rawInput: string
  needle: string
}

type CandidateBuilder<TItem> = (context: SuggestionContext<TItem>) => SearchTokenData[]

const makeUid = (prefix: string, value: string): string => `${prefix}|${value}`

const isNumberLikeColumn = (column: { valueType?: string }): boolean =>
  column.valueType === 'number-like'

const escapeRegExp = (value: string): string =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

class SuggestionService {
  constructor(private readonly dependencies: SuggestionServiceDependencies) {
  }

  private getRelativeCandidates<TItem>(
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchTokenData[],
    rawInput: string,
  ): SearchTokenData[] {
    return this.dependencies.policies.relativeDateSuggestionPolicy.suggest(modelDefinition, selected, rawInput)
  }

  private getDateOperationCandidates(
    selected: SearchTokenData[],
    rawInput: string,
  ): SearchTokenData[] {
    return this.dependencies.policies.dateOperationSuggestionPolicy.suggest(selected, rawInput)
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
    selected: SearchTokenData[],
    needle: string,
  ): SearchTokenData[] {
    const selectedTypes = new Set(
      selected
        .map((token) => token.type)
        .filter((tokenType) => tokenType && SearchTokenModel.isExactCellValueType(tokenType)),
    )

    const candidates: RankedSearchToken[] = []
    const seen = new Set<string>()
    const baseRows = this.dependencies.filterItems(items, modelDefinition, selected)

    modelDefinition.columns
      .filter((column) => column.suggestionEnabled !== false)
      .forEach((column) => {
        if (selectedTypes.has(column.key)) return

        new Set(baseRows.map((item) => readValue(item, column))).forEach((value) => {
          const columnValueText = String(value ?? '')
          if (!columnValueText) return

          const uid = makeUid(column.key, columnValueText)
          if (seen.has(uid)) return
          seen.add(uid)

          const displayTitle = isNumberLikeColumn(column) ? formatGroupedNumber(columnValueText) : columnValueText
          const scoreTitle = isNumberLikeColumn(column) ? columnValueText : displayTitle
          const score = this.dependencies.policies.textSuggestionScoringPolicy.score(scoreTitle, column.label, needle)
          if (score < 0 && needle.length > 0) return

          candidates.push({
            uid,
            type: column.key,
            key: column.key,
            title: displayTitle,
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
      return token as SearchTokenData
    })
  }

  private buildScopeCandidates<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchTokenData[],
    needle: string,
  ): SearchTokenData[] {
    const fulltextTerms = selected
      .filter((token) => SearchTokenModel.isFulltext(token))
      .map((token) => String(token.title || '').toLowerCase())
      .filter((term) => term.length > 0)

    const exactOnly = selected.filter((token) => SearchTokenModel.isExactCellValue(token))
    const baseRows = this.dependencies.filterItems(items, modelDefinition, exactOnly)

    const selectedScope = new Set(
      selected
        .filter(
          (token): token is SearchTokenData & { key: string } =>
            SearchTokenModel.isScope(token) && 'key' in token,
        )
        .map((token) => token.key),
    )

    const scoped = modelDefinition.columns
      .filter((column) => column.searchable !== false)
      .filter((column) => !selectedScope.has(column.key))
      .map((column) => {
        const matchCount = this.countColumnMatchesForTerms(baseRows, modelDefinition, column.key, fulltextTerms)
        const score = needle.length === 0
          ? 1
          : this.dependencies.policies.textSuggestionScoringPolicy.score(column.label, 'Fulltext scope', needle)

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
      return token as SearchTokenData
    })
  }

  private collectCandidates<TItem>(
    context: SuggestionContext<TItem>,
    builders: CandidateBuilder<TItem>[],
  ): SearchTokenData[] {
    const candidateLists = builders.map((builder) => builder(context))
    return this.dependencies.policies.uniqueSuggestionMergeService.merge(...candidateLists)
  }

  buildSuggestions<TItem>(
    items: TItem[],
    modelDefinition: SearchModelDefinition<TItem>,
    selected: SearchTokenData[],
    rawInput: string,
  ): SearchTokenData[] {
    const needle = String(rawInput || '').trim().toLowerCase()
    const maxSuggestions = modelDefinition.maxSuggestions ?? 7

    const context: SuggestionContext<TItem> = {
      items,
      modelDefinition,
      selected,
      rawInput,
      needle,
    }

    const buildDateOperationCandidatesFromContext =
      (innerContext: SuggestionContext<TItem>): SearchTokenData[] =>
      this.getDateOperationCandidates(innerContext.selected, innerContext.rawInput)

    const buildRelativeCandidatesFromContext =
      (innerContext: SuggestionContext<TItem>): SearchTokenData[] =>
      this.getRelativeCandidates(innerContext.modelDefinition, innerContext.selected, innerContext.rawInput)

    const buildScopeCandidatesFromContext =
      (innerContext: SuggestionContext<TItem>): SearchTokenData[] =>
      this.buildScopeCandidates(
        innerContext.items,
        innerContext.modelDefinition,
        innerContext.selected,
        innerContext.needle,
      )

    const buildNormalCandidatesFromContext =
      (innerContext: SuggestionContext<TItem>): SearchTokenData[] =>
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

    const fulltextActive = selected.some((token) => SearchTokenModel.isFulltext(token))

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

const createSuggestionServiceDependencies = (
  overrides?: Partial<SuggestionServiceDependencies>,
): SuggestionServiceDependencies => ({
  policies: overrides?.policies ?? createSuggestionPolicies(),
  filterItems: overrides?.filterItems ?? filterItems,
})

export const createSuggestionService = (
  overrides?: Partial<SuggestionServiceDependencies>,
): Pick<SuggestionService, 'buildSuggestions'> => {
  const dependencies = createSuggestionServiceDependencies(overrides)
  return new SuggestionService(dependencies)
}

const suggestionService = createSuggestionService()

export const buildSuggestionsService = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchTokenData[],
  rawInput: string,
): SearchTokenData[] => suggestionService.buildSuggestions(items, modelDefinition, selected, rawInput)

export const buildSuggestions = <TItem>(
  items: TItem[],
  modelDefinition: SearchModelDefinition<TItem>,
  selected: SearchTokenData[],
  rawInput: string,
): SearchTokenData[] => buildSuggestionsService(items, modelDefinition, selected, rawInput)
