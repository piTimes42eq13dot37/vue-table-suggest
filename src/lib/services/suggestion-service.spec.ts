import { describe, expect, it } from 'vitest'
import { demoModelDefinition, demoRows } from '../../testing/demo-fixtures'
import { DateReference } from '../models/date-reference'
import { DateRelation } from '../models/date-relation'
import type { SearchModelDefinition } from '../models/external'
import type { SearchToken as SearchTokenData } from '../models/internal'
import { SearchTokenModel, resolveTokenCategory } from '../models/search-token'
import { buildSuggestions } from './suggestion-service'

describe('suggestion-service', () => {
  it('returns no suggestions for short relative query input', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'be')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(false)
  })

  it('returns relative date suggestions for before next weekday', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'before next mon')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before next'))).toBe(true)
  })

  it('expands before monday into before last and before next suggestions', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'before monday')

    expect(suggestions.some((token) => token.title.toLowerCase().includes('before last'))).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before next'))).toBe(true)
  })

  it('keeps anchored before last monday suggestions', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'before last monday')

    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before last'))).toBe(true)
  })

  it('returns relative suggestions for shorthand last monday input', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'last monday')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('on last'))).toBe(true)
  })

  it('returns relative suggestions for date-prefixed phrase', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'date after last monday')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('after last'))).toBe(true)
  })

  it('returns four expected suggestions for after t', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'after t')
    const titles = suggestions.map((token) => token.title)

    expect(titles).toEqual([
      'after last Tuesday',
      'after next Tuesday',
      'after last Thursday',
      'after next Thursday',
    ])
  })

  it('returns four expected suggestions for before t', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'before t')
    const titles = suggestions.map((token) => token.title)

    expect(titles).toEqual([
      'before last Tuesday',
      'before next Tuesday',
      'before last Thursday',
      'before next Thursday',
    ])
  })

  it('returns relative suggestions for after last thursday phrase', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'after last thursday')

    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(
      suggestions.some(
        (token) =>
          token.title.toLowerCase().includes('after last') &&
          token.title.toLowerCase().includes('thursday'),
      ),
    ).toBe(true)
  })

  it('does not include date_relative suggestions when one is already selected', () => {
    const suggestions = buildSuggestions(
      demoRows(),
      demoModelDefinition(),
      [
        {
          uid: 'date_relative|before|next|0|09.03.2026',
          type: 'date_relative',
          title: 'before next monday',
          rawTitle: '09.03.2026',
          dateRelation: DateRelation.Before,
          reference: DateReference.Next,
        },
      ],
      'before next mon',
    )

    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(false)
  })

  it('returns only date operation suggestions when input is an exact date', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], '02.03.2026')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((token) => String(token.type).startsWith('date_'))).toBe(true)
  })

  it('prefers start-position matches over end-position matches', () => {
    type Row = { label: string }
    const items: Row[] = [{ label: 'alpha beta' }, { label: 'beta alpha' }]
    const modelDefinition: SearchModelDefinition<Row> = {
      modelName: 'Row',
      columns: [{ key: 'label', label: 'Label', searchable: true, sortable: true }],
    }

    const suggestions = buildSuggestions(items, modelDefinition, [], 'alpha')
    expect(suggestions.length).toBeGreaterThan(1)
    expect(suggestions[0]?.title).toBe('alpha beta')
    expect(suggestions[1]?.title).toBe('beta alpha')
  })

  it('ranks middle-position matches between start and end matches', () => {
    type Row = { label: string }
    const items: Row[] = [{ label: 'alpha beta' }, { label: 'beta alpha z' }, { label: 'beta z alpha' }]
    const modelDefinition: SearchModelDefinition<Row> = {
      modelName: 'Row',
      columns: [{ key: 'label', label: 'Label', searchable: true, sortable: true }],
    }

    const suggestions = buildSuggestions(items, modelDefinition, [], 'alpha')
    const titles = suggestions.map((suggestion) => suggestion.title)

    expect(titles.indexOf('alpha beta')).toBeLessThan(titles.indexOf('beta alpha z'))
    expect(titles.indexOf('beta alpha z')).toBeLessThan(titles.indexOf('beta z alpha'))
  })

  it('keeps top 3 best-scored matches first, then introduces other matching categories', () => {
    type Row = { product: string; owner: string }
    const items: Row[] = [
      { product: 'alpha product', owner: 'bank clerk one' },
      { product: 'alpha plan', owner: 'bank clerk two' },
      { product: 'alpha pension', owner: 'bank clerk three' },
      { product: 'omega product', owner: 'owner alpha' },
    ]
    const modelDefinition: SearchModelDefinition<Row> = {
      modelName: 'Row',
      columns: [
        { key: 'product', label: 'Product', searchable: true, sortable: true },
        { key: 'owner', label: 'Owner', searchable: true, sortable: true },
      ],
    }

    const suggestions = buildSuggestions(items, modelDefinition, [], 'alpha')
    expect(suggestions.length).toBeGreaterThan(3)

    expect(suggestions[0]?.type).toBe('product')
    expect(suggestions[1]?.type).toBe('product')
    expect(suggestions[2]?.type).toBe('product')
    expect(suggestions[3]?.type).toBe('owner')
  })

  it('counts scope matches per column only for fulltext terms (moon case)', () => {
    const suggestions = buildSuggestions(
      demoRows(),
      demoModelDefinition(),
      [
        {
          uid: 'fulltext|moon',
          type: 'fulltext',
          title: 'moon',
        },
      ],
      '',
    )

    const fulltextScopeSuggestions = suggestions
      .filter(
        (token): token is SearchTokenData & { key: string; matchCount?: number } =>
          SearchTokenModel.isScope(token) && 'key' in token,
      )
    const hangarFulltextScope = fulltextScopeSuggestions.find((token) => token.key === 'hangar')
    const hangarCodeFulltextScope = fulltextScopeSuggestions.find((token) => token.key === 'hangarCode')

    expect(hangarFulltextScope?.matchCount).toBe(4)
    expect(hangarCodeFulltextScope).toBeUndefined()
  })

  it('keeps deterministic suggestion ordering for moon query (golden master)', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], 'moon')

    expect(
      suggestions.map((token) => ({
        uid: token.uid,
        type: token.type,
        title: token.title,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "title": "Moon Pantry Hyper",
          "type": "hangar",
          "uid": "hangar|Moon Pantry Hyper",
        },
        {
          "title": "Moon Pantry Ultra",
          "type": "hangar",
          "uid": "hangar|Moon Pantry Ultra",
        },
        {
          "title": "Moon Pantry Classic",
          "type": "hangar",
          "uid": "hangar|Moon Pantry Classic",
        },
        {
          "title": "Moon Sprinkles Epsilon",
          "type": "product",
          "uid": "product|Moon Sprinkles Epsilon",
        },
      ]
    `)
  })

  it('keeps deterministic date token creation for exact date query (golden master)', () => {
    const suggestions = buildSuggestions(demoRows(), demoModelDefinition(), [], '02.03.2026')

    expect(
      suggestions.map((token) => ({
        uid: token.uid,
        type: token.type,
        title: token.title,
        category: resolveTokenCategory(token),
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "category": "date before",
          "title": "02.03.2026",
          "type": "date_before",
          "uid": "date_before|02.03.2026",
        },
        {
          "category": "date after",
          "title": "02.03.2026",
          "type": "date_after",
          "uid": "date_after|02.03.2026",
        },
        {
          "category": "date exact",
          "title": "02.03.2026",
          "type": "date_exact",
          "uid": "date_exact|02.03.2026",
        },
      ]
    `)
  })
})
