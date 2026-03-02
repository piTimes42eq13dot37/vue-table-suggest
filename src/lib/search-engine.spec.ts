import { describe, expect, it } from 'vitest'
import {
  buildSuggestions,
  createSearchEngine,
  filterItems,
  highlightText,
  searchEngine,
} from './search-engine'
import { DemoItem, demoModelDefinition, demoRows } from '../testing/demo-fixtures'
import type { SearchToken } from './models/internal'

describe('search-engine', () => {
  it('filters by hangarCode exact through nested hangar object', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const result = filterItems(rows, modelDefinition, [
      {
        uid: 'hangarCode|10000021304',
        type: 'hangarCode',
        title: '10000021304',
      },
    ])

    expect(result).toHaveLength(1)
    expect((result[0] as DemoItem).hangar.number).toBe('10000021304')
  })

  it('filters by relative date reference for on next weekday token', () => {
    const modelDefinition = demoModelDefinition()
    const items: DemoItem[] = [
      {
        id: 1,
        product: 'A',
        hangar: { type: 'X', number: '1' },
        number: '1',
        owner: 'o',
        date: '03.03.2026',
        status: 'new',
      },
      {
        id: 2,
        product: 'B',
        hangar: { type: 'Y', number: '2' },
        number: '2',
        owner: 'o',
        date: '04.03.2026',
        status: 'new',
      },
    ]

    const tokens: SearchToken[] = [
      {
        uid: 'date_relative|on|next|1|03.03.2026',
        type: 'date_relative',
        title: 'on next Tuesday',
        rawTitle: '03.03.2026',
        direction: 'on',
        category: 'date exact',
      },
    ]

    const result = filterItems(items, modelDefinition, tokens)
    expect(result).toHaveLength(1)
    expect(result[0]?.date).toBe('03.03.2026')
  })

  it('returns scope suggestions with match count when fulltext is active and query is empty', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const suggestions = buildSuggestions(
      rows,
      modelDefinition,
      [
        {
          uid: 'fulltext|orbital',
          type: 'fulltext',
          title: 'orbital',
        },
      ],
      '',
    )

    const scopeSuggestions = suggestions.filter((token) => token.type === 'scope')
    expect(scopeSuggestions.length).toBeGreaterThan(0)
    expect(scopeSuggestions.some((token) => (token.matchCount ?? 0) > 0)).toBe(true)
  })

  it('returns only date suggestions when query is a date and no fulltext token is active', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const suggestions = buildSuggestions(rows, modelDefinition, [], '28.02.2026')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((token) => String(token.type).startsWith('date_'))).toBe(true)
  })

  it('returns no suggestions for empty query without fulltext token', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const suggestions = buildSuggestions(rows, modelDefinition, [], '')
    expect(suggestions).toHaveLength(0)
  })

  it('escapes HTML before applying highlights', () => {
    const html = highlightText('<img src=x onerror=alert(1)> alpha', ['alpha'])
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
    expect(html).toContain('<mark>alpha</mark>')
  })

  it('exposes equivalent behavior through searchEngine contract object', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const viaContract = searchEngine.buildSuggestions(rows, modelDefinition, [], 'moon')
    const viaFunction = buildSuggestions(rows, modelDefinition, [], 'moon')

    expect(viaContract).toEqual(viaFunction)
  })

  it('supports dependency overrides through createSearchEngine', () => {
    const engine = createSearchEngine({
      resolveEnglishLocale: () => 'de-DE',
      highlightText: () => 'highlighted',
    })

    expect(engine.resolveEnglishLocale()).toBe('de-DE')
    expect(engine.highlightText('value', ['v'])).toBe('highlighted')
  })

  it('matches fulltext against nested sub-attribute values (hangar.number)', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const result = filterItems(rows, modelDefinition, [
      {
        uid: 'fulltext|21304',
        type: 'fulltext',
        title: '21304',
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    expect(result.some((row) => row.hangar.number.includes('21304'))).toBe(true)
  })

  it('respects scope when matching nested sub-attributes', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const result = filterItems(rows, modelDefinition, [
      {
        uid: 'fulltext|classic',
        type: 'fulltext',
        title: 'classic',
      },
      {
        uid: 'scope|hangar',
        type: 'scope',
        key: 'hangar',
        title: 'Hangar',
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((row) => row.hangar.type.toLowerCase().includes('classic'))).toBe(true)
  })

  it('returns suggestions for nested sub-attribute values', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()

    const suggestions = buildSuggestions(rows, modelDefinition, [], '21304')
    expect(suggestions.some((token) => token.type === 'hangarCode')).toBe(true)
  })

  it('returns only matching suggestions except for special suggestion types', () => {
    const rows = demoRows()
    const modelDefinition = demoModelDefinition()
    const query = '02.03.2026'

    const suggestions = buildSuggestions(
      rows,
      modelDefinition,
      [
        {
          uid: 'fulltext|hangar',
          type: 'fulltext',
          title: 'hangar',
        },
      ],
      query,
    )

    const isSpecialType = (type: string): boolean =>
      type === 'scope' || type === 'date_relative' || type.startsWith('date_')

    const nonSpecial = suggestions.filter((token) => !isSpecialType(String(token.type)))
    expect(nonSpecial.every((token) => String(token.title).toLowerCase().includes(query.toLowerCase()))).toBe(true)

    expect(suggestions.some((token) => isSpecialType(String(token.type)))).toBe(true)
  })
})
