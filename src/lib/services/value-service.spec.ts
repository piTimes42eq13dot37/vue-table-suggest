import { describe, expect, it } from 'vitest'
import type { SearchModelDefinition } from '../models/external'
import {
  expandScopeKeys,
  formatGroupedNumber,
  getScopeColumns,
  normalizeNumberLike,
  readValue,
  readValueByKey,
} from './value-service'

interface Item {
  id: number
  product: string
  hangar: { type: string; number: string }
}

const modelDefinition: SearchModelDefinition<Item> = {
  modelName: 'Item',
  columns: [
    { key: 'id', label: 'id', searchable: true },
    { key: 'product', label: 'Product', searchable: true },
    {
      key: 'hangar',
      label: 'Hangar',
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.type,
    },
    {
      key: 'hangarCode',
      label: 'Hangar Code',
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.number,
      valueType: 'number-like',
      renderAsSublineOf: 'hangar',
    },
  ],
}

const sample: Item = {
  id: 1,
  product: 'Classic Pension Alpha',
  hangar: { type: 'Orbital Locker Classic', number: '10000021304' },
}

describe('value-service', () => {
  it('normalizes and formats grouped numbers', () => {
    expect(normalizeNumberLike('100.000-21304')).toBe('10000021304')
    expect(formatGroupedNumber('10000021304')).toBe('10.000.021.304')
  })

  it('reads values from accessors and keys', () => {
    expect(readValue(sample, modelDefinition.columns[0]!)).toBe('1')
    expect(readValue(sample, modelDefinition.columns[2]!)).toBe('Orbital Locker Classic')
  })

  it('expands scope keys by scope group', () => {
    const keys = expandScopeKeys(modelDefinition, ['hangar'])
    expect(keys).toContain('hangar')
    expect(keys).toContain('hangarCode')
  })

  it('returns scope columns for empty and selected scopes', () => {
    const allSearchable = getScopeColumns(modelDefinition, [])
    expect(allSearchable.length).toBe(4)

    const scoped = getScopeColumns(modelDefinition, ['hangar'])
    expect(scoped.map((column) => column.key)).toEqual(['hangar', 'hangarCode'])
  })

  it('reads value by key with model definition lookup and fallback', () => {
    expect(readValueByKey(sample, modelDefinition, 'hangarCode')).toBe('10000021304')
    expect(readValueByKey(sample, modelDefinition, 'unknown')).toBe('')
  })
})
