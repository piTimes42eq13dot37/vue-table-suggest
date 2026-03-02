class DateDomainService {
  startOfDay(date: Date): Date {
    const value = new Date(date)
    value.setHours(0, 0, 0, 0)
    return value
  }

  parseDateInput(value: string): Date | null {
    const input = String(value ?? '').trim()
    const dotFormatMatch = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
    const isoFormatMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (!dotFormatMatch && !isoFormatMatch) return null

    const year = Number(dotFormatMatch ? dotFormatMatch[3] : isoFormatMatch![1])
    const month = Number(dotFormatMatch ? dotFormatMatch[2] : isoFormatMatch![2])
    const day = Number(dotFormatMatch ? dotFormatMatch[1] : isoFormatMatch![3])
    const parsed = new Date(year, month - 1, day)
    parsed.setHours(0, 0, 0, 0)

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null
    }

    return parsed
  }

  formatDate(date: Date): string {
    const value = this.startOfDay(date)
    const day = String(value.getDate()).padStart(2, '0')
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const year = value.getFullYear()
    return `${day}.${month}.${year}`
  }

  getMondayIndexFromDate(date: Date): number {
    const jsDay = this.startOfDay(date).getDay()
    return (jsDay + 6) % 7
  }

  getLocalizedWeekdaysMondayFirst(locale = 'en-US'): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    const mondayRef = new Date(2024, 0, 1)

    return Array.from({ length: 7 }, (_, index) => {
      const value = new Date(mondayRef)
      value.setDate(mondayRef.getDate() + index)
      return formatter.format(value)
    })
  }

  getReferenceWeekdayDate(
    reference: 'last' | 'next',
    weekdayIndexMonday: number,
    now = new Date(),
  ): Date {
    const today = this.startOfDay(now)
    const todayMondayIndex = this.getMondayIndexFromDate(today)

    const target = new Date(today)
    if (reference === 'last') {
      const diff = (todayMondayIndex - weekdayIndexMonday + 7) % 7 || 7
      target.setDate(today.getDate() - diff)
      return target
    }

    const diff = (weekdayIndexMonday - todayMondayIndex + 7) % 7 || 7
    target.setDate(today.getDate() + diff)
    return target
  }

  getIsoWeekInfo(date: Date): { weekNo: number; weekYear: number } {
    const target = this.startOfDay(date)
    const day = (target.getDay() + 6) % 7
    const isoWeekAnchor = new Date(target)
    isoWeekAnchor.setDate(target.getDate() - day + 3)

    const weekYear = isoWeekAnchor.getFullYear()
    const firstIsoWeekAnchor = new Date(weekYear, 0, 4)
    const firstIsoWeekAnchorDay = (firstIsoWeekAnchor.getDay() + 6) % 7
    firstIsoWeekAnchor.setDate(firstIsoWeekAnchor.getDate() - firstIsoWeekAnchorDay + 3)

    const weekNo =
      1 + Math.round((isoWeekAnchor.getTime() - firstIsoWeekAnchor.getTime()) / 604800000)
    return { weekNo, weekYear }
  }

  getDateMouseoverLabel(dateValue: string, locale = 'en-US'): string {
    const parsed = this.parseDateInput(dateValue)
    if (!parsed) return ''

    const weekday = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
    }).format(parsed)

    const { weekNo, weekYear } = this.getIsoWeekInfo(parsed)
    return `KW ${String(weekNo).padStart(2, '0')}/${weekYear} - ${weekday}`
  }
}

export const dateDomainService = new DateDomainService()
