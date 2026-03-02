import { describe, expect, it } from 'vitest'
import { demoRows } from '../demo-data'
import { demoAnnotations } from '../demo-model'
import type { ModelAnnotations } from '../types'
import { buildSuggestions } from './suggestion-service'

describe('suggestion-service', () => {
  it('returns no suggestions for short relative query input', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'be')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(false)
  })

  it('returns relative date suggestions for before next weekday', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'before next mon')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before next'))).toBe(true)
  })

  it('expands before monday into before last and before next suggestions', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'before monday')

    expect(suggestions.some((token) => token.title.toLowerCase().includes('before last'))).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before next'))).toBe(true)
  })

  it('keeps anchored before last monday suggestions', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'before last monday')

    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('before last'))).toBe(true)
  })

  it('returns relative suggestions for shorthand last monday input', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'last monday')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('on last'))).toBe(true)
  })

  it('returns relative suggestions for date-prefixed phrase', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'date after last monday')
    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(true)
    expect(suggestions.some((token) => token.title.toLowerCase().includes('after last'))).toBe(true)
  })

  it('returns four expected suggestions for after t', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'after t')
    const titles = suggestions.map((token) => token.title)

    expect(titles).toEqual([
      'after last Tuesday',
      'after next Tuesday',
      'after last Thursday',
      'after next Thursday',
    ])
  })

  it('returns four expected suggestions for before t', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'before t')
    const titles = suggestions.map((token) => token.title)

    expect(titles).toEqual([
      'before last Tuesday',
      'before next Tuesday',
      'before last Thursday',
      'before next Thursday',
    ])
  })

  it('returns relative suggestions for after last thursday phrase', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], 'after last thursday')

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
      demoAnnotations(),
      [
        {
          uid: 'date_relative|before|next|0|09.03.2026',
          type: 'date_relative',
          title: 'before next monday',
          rawTitle: '09.03.2026',
          direction: 'before',
          anchor: 'next',
        },
      ],
      'before next mon',
    )

    expect(suggestions.some((token) => token.type === 'date_relative')).toBe(false)
  })

  it('returns only date operation suggestions when input is an exact date', () => {
    const suggestions = buildSuggestions(demoRows(), demoAnnotations(), [], '02.03.2026')
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((token) => String(token.type).startsWith('date_'))).toBe(true)
  })

  it('prefers start-position matches over end-position matches', () => {
    type Row = { label: string }
    const items: Row[] = [{ label: 'alpha beta' }, { label: 'beta alpha' }]
    const annotations: ModelAnnotations<Row> = {
      modelName: 'Row',
      columns: [{ key: 'label', label: 'Label', searchable: true, sortable: true }],
    }

    const suggestions = buildSuggestions(items, annotations, [], 'alpha')
    expect(suggestions.length).toBeGreaterThan(1)
    expect(suggestions[0]?.title).toBe('alpha beta')
    expect(suggestions[1]?.title).toBe('beta alpha')
  })

  it('ranks middle-position matches between start and end matches', () => {
    type Row = { label: string }
    const items: Row[] = [{ label: 'alpha beta' }, { label: 'beta alpha z' }, { label: 'beta z alpha' }]
    const annotations: ModelAnnotations<Row> = {
      modelName: 'Row',
      columns: [{ key: 'label', label: 'Label', searchable: true, sortable: true }],
    }

    const suggestions = buildSuggestions(items, annotations, [], 'alpha')
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
    const annotations: ModelAnnotations<Row> = {
      modelName: 'Row',
      columns: [
        { key: 'product', label: 'Product', searchable: true, sortable: true },
        { key: 'owner', label: 'Owner', searchable: true, sortable: true },
      ],
    }

    const suggestions = buildSuggestions(items, annotations, [], 'alpha')
    expect(suggestions.length).toBeGreaterThan(3)

    expect(suggestions[0]?.type).toBe('product')
    expect(suggestions[1]?.type).toBe('product')
    expect(suggestions[2]?.type).toBe('product')
    expect(suggestions[3]?.type).toBe('owner')
  })

  it('counts scope matches per column only for fulltext terms (moon case)', () => {
    const suggestions = buildSuggestions(
      demoRows(),
      demoAnnotations(),
      [
        {
          uid: 'fulltext|moon',
          type: 'fulltext',
          title: 'moon',
        },
      ],
      '',
    )

    const scopeSuggestions = suggestions.filter((token) => token.type === 'scope')
    const hangarScope = scopeSuggestions.find((token) => token.key === 'hangar')
    const hangarCodeScope = scopeSuggestions.find((token) => token.key === 'hangarCode')

    expect(hangarScope?.matchCount).toBe(4)
    expect(hangarCodeScope).toBeUndefined()
  })
})
