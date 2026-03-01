import { describe, expect, it } from 'vitest'
import { parseDateInput } from '../date'
import { demoRows } from '../demo-data'
import { demoAnnotations } from '../demo-model'
import { filterItems } from './filter-service'

describe('filter-service', () => {
  it('filters by date_before token', () => {
    const rows = demoRows()
    const pivot = rows[3]!.date
    const result = filterItems(rows, demoAnnotations(), [
      {
        uid: `date_before|${pivot}`,
        type: 'date_before',
        title: pivot,
        rawTitle: pivot,
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    const pivotTime = parseDateInput(pivot)!.getTime()
    expect(result.every((row) => parseDateInput(row.date)!.getTime() < pivotTime)).toBe(true)
  })

  it('filters by date_after token', () => {
    const rows = demoRows()
    const pivot = rows[0]!.date
    const result = filterItems(rows, demoAnnotations(), [
      {
        uid: `date_after|${pivot}`,
        type: 'date_after',
        title: pivot,
        rawTitle: pivot,
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    const pivotTime = parseDateInput(pivot)!.getTime()
    expect(result.every((row) => parseDateInput(row.date)!.getTime() > pivotTime)).toBe(true)
  })

  it('filters by date_exact token', () => {
    const rows = demoRows()
    const exactDate = rows[0]!.date

    const result = filterItems(rows, demoAnnotations(), [
      {
        uid: `date_exact|${exactDate}`,
        type: 'date_exact',
        title: exactDate,
        rawTitle: exactDate,
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((row) => row.date === exactDate)).toBe(true)
  })

  it('returns empty for invalid date token values', () => {
    const rows = demoRows()
    const result = filterItems(rows, demoAnnotations(), [
      {
        uid: 'date_before|invalid',
        type: 'date_before',
        title: 'invalid',
      },
    ])

    expect(result).toHaveLength(0)
  })
})
