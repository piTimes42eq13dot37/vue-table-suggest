import { describe, expect, it } from 'vitest'
import {
  formatDate,
  getAnchorWeekdayDate,
  getDateMouseoverLabel,
  getIsoWeekInfo,
  getLocalizedWeekdaysMondayFirst,
  getMondayIndexFromDate,
  parseDateInput,
  startOfDay,
} from './date'

describe('date', () => {
  it('normalizes start of day', () => {
    const value = startOfDay(new Date('2026-02-28T18:45:13'))
    expect(value.getHours()).toBe(0)
    expect(value.getMinutes()).toBe(0)
    expect(value.getSeconds()).toBe(0)
  })

  it('parses and formats dd.mm.yyyy dates', () => {
    const parsed = parseDateInput('28.02.2026')
    expect(parsed).not.toBeNull()
    expect(formatDate(parsed!)).toBe('28.02.2026')
  })

  it('parses iso yyyy-mm-dd dates', () => {
    const parsed = parseDateInput('2026-02-28')
    expect(parsed).not.toBeNull()
    expect(formatDate(parsed!)).toBe('28.02.2026')
  })

  it('rejects invalid date inputs', () => {
    expect(parseDateInput('')).toBeNull()
    expect(parseDateInput('31.02.2026')).toBeNull()
    expect(parseDateInput('2026-13-28')).toBeNull()
  })

  it('returns monday-first index', () => {
    expect(getMondayIndexFromDate(new Date('2026-03-02'))).toBe(0)
    expect(getMondayIndexFromDate(new Date('2026-03-08'))).toBe(6)
  })

  it('returns seven localized weekdays monday-first', () => {
    const weekdays = getLocalizedWeekdaysMondayFirst('en-US')
    expect(weekdays).toHaveLength(7)
    expect(weekdays[0]?.toLowerCase()).toContain('mon')
  })

  it('computes anchor weekday date for last and next', () => {
    const now = new Date('2026-03-04')
    const lastMonday = getAnchorWeekdayDate('last', 0, now)
    const nextMonday = getAnchorWeekdayDate('next', 0, now)

    expect(formatDate(lastMonday)).toBe('02.03.2026')
    expect(formatDate(nextMonday)).toBe('09.03.2026')
  })

  it('computes iso week info and tooltip', () => {
    const info = getIsoWeekInfo(new Date('2026-01-01'))
    expect(info.weekNo).toBeGreaterThan(0)
    expect(info.weekYear).toBe(2026)

    const label = getDateMouseoverLabel('02.03.2026', 'en-US')
    expect(label.startsWith('KW ')).toBe(true)
    expect(label.toLowerCase()).toContain('monday')
  })
})
