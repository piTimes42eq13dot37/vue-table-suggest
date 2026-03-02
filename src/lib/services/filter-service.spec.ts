import { describe, expect, it } from 'vitest'
import { dateDomainService } from './date-service'
import { demoModelDefinition, demoRows } from '../../testing/demo-fixtures'
import { filterItems } from './filter-service'

describe('filter-service', () => {
  it('filters by date_before token', () => {
    const rows = demoRows()
    const pivot = rows[3]!.date
    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: `date_before|${pivot}`,
        type: 'date_before',
        title: pivot,
        rawTitle: pivot,
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    const pivotTime = dateDomainService.parseDateInput(pivot)!.getTime()
    expect(result.every((row) => dateDomainService.parseDateInput(row.date)!.getTime() < pivotTime)).toBe(
      true,
    )
  })

  it('filters by date_after token', () => {
    const rows = demoRows()
    const pivot = rows[0]!.date
    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: `date_after|${pivot}`,
        type: 'date_after',
        title: pivot,
        rawTitle: pivot,
      },
    ])

    expect(result.length).toBeGreaterThan(0)
    const pivotTime = dateDomainService.parseDateInput(pivot)!.getTime()
    expect(result.every((row) => dateDomainService.parseDateInput(row.date)!.getTime() > pivotTime)).toBe(
      true,
    )
  })

  it('filters by date_exact token', () => {
    const rows = demoRows()
    const exactDate = rows[0]!.date
    const result = filterItems(rows, demoModelDefinition(), [
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
    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: 'date_before|invalid',
        type: 'date_before',
        title: 'invalid',
      },
    ])

    expect(result).toHaveLength(0)
  })

  it('filters by date_relative token for after last thursday', () => {
    const referenceDate = dateDomainService.getReferenceWeekdayDate('last', 3)
    const referenceDateText = dateDomainService.formatDate(referenceDate)
    const dayBefore = new Date(referenceDate)
    dayBefore.setDate(dayBefore.getDate() - 1)
    const dayAfter = new Date(referenceDate)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const rows = [
      {
        id: 1,
        product: 'A',
        hangar: { type: 'Type', number: '1' },
        number: '1',
        owner: 'owner',
        date: dateDomainService.formatDate(dayBefore),
        status: 'new',
      },
      {
        id: 2,
        product: 'B',
        hangar: { type: 'Type', number: '2' },
        number: '2',
        owner: 'owner',
        date: dateDomainService.formatDate(referenceDate),
        status: 'new',
      },
      {
        id: 3,
        product: 'C',
        hangar: { type: 'Type', number: '3' },
        number: '3',
        owner: 'owner',
        date: dateDomainService.formatDate(dayAfter),
        status: 'new',
      },
    ]

    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: `date_relative|after|last|3|${referenceDateText}`,
        type: 'date_relative',
        title: 'after last Thursday',
        rawTitle: referenceDateText,
        direction: 'after',
        reference: 'last',
        category: 'date after',
      },
    ])

    expect(result.map((row) => row.date)).toEqual([dateDomainService.formatDate(dayAfter)])
  })

  it('filters by date_relative token for before next thursday', () => {
    const referenceDate = dateDomainService.getReferenceWeekdayDate('next', 3)
    const referenceDateText = dateDomainService.formatDate(referenceDate)
    const dayBefore = new Date(referenceDate)
    dayBefore.setDate(dayBefore.getDate() - 1)
    const dayAfter = new Date(referenceDate)
    dayAfter.setDate(dayAfter.getDate() + 1)

    const rows = [
      {
        id: 1,
        product: 'A',
        hangar: { type: 'Type', number: '1' },
        number: '1',
        owner: 'owner',
        date: dateDomainService.formatDate(dayBefore),
        status: 'new',
      },
      {
        id: 2,
        product: 'B',
        hangar: { type: 'Type', number: '2' },
        number: '2',
        owner: 'owner',
        date: dateDomainService.formatDate(referenceDate),
        status: 'new',
      },
      {
        id: 3,
        product: 'C',
        hangar: { type: 'Type', number: '3' },
        number: '3',
        owner: 'owner',
        date: dateDomainService.formatDate(dayAfter),
        status: 'new',
      },
    ]

    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: `date_relative|before|next|3|${referenceDateText}`,
        type: 'date_relative',
        title: 'before next Thursday',
        rawTitle: referenceDateText,
        direction: 'before',
        reference: 'next',
        category: 'date before',
      },
    ])

    expect(result.map((row) => row.date)).toEqual([dateDomainService.formatDate(dayBefore)])
  })

  it('computes last tuesday date before applying after filter', () => {
    const referenceDate = dateDomainService.getReferenceWeekdayDate('last', 1)
    const dayAfter = new Date(referenceDate)
    dayAfter.setDate(dayAfter.getDate() + 1)
    const twoDaysAfter = new Date(referenceDate)
    twoDaysAfter.setDate(twoDaysAfter.getDate() + 2)

    const rows = [
      {
        id: 1,
        product: 'A',
        hangar: { type: 'Type', number: '1' },
        number: '1',
        owner: 'owner',
        date: dateDomainService.formatDate(referenceDate),
        status: 'new',
      },
      {
        id: 2,
        product: 'B',
        hangar: { type: 'Type', number: '2' },
        number: '2',
        owner: 'owner',
        date: dateDomainService.formatDate(dayAfter),
        status: 'new',
      },
      {
        id: 3,
        product: 'C',
        hangar: { type: 'Type', number: '3' },
        number: '3',
        owner: 'owner',
        date: dateDomainService.formatDate(twoDaysAfter),
        status: 'new',
      },
    ]

    const result = filterItems(rows, demoModelDefinition(), [
      {
        uid: `date_relative|after|last|1|${dateDomainService.formatDate(referenceDate)}`,
        type: 'date_relative',
        title: 'after last tuesday',
        rawTitle: dateDomainService.formatDate(referenceDate),
        direction: 'after',
        reference: 'last',
        category: 'date after',
      },
    ])

    expect(result.map((row) => row.date)).toEqual([
      dateDomainService.formatDate(dayAfter),
      dateDomainService.formatDate(twoDaysAfter),
    ])
  })
})
