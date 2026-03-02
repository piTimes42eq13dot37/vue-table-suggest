import type { SearchColumnDefinition, SearchModelDefinition } from '../models/external'

export interface TableSortState {
  key: string
  asc: boolean
}

export interface HighlightSegment {
  text: string
  highlighted: boolean
}

class TableSuggestPresenterService {
  private escapeRegExp(value: string): string {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  private normalizeDigits(value: string): string {
    return String(value || '').replace(/[^0-9]/g, '')
  }

  private buildTermPattern(term: string): string {
    const normalized = this.normalizeDigits(term)
    const isDigitsOnly = normalized.length > 0 && normalized === term

    if (!isDigitsOnly) {
      return this.escapeRegExp(term)
    }

    return normalized
      .split('')
      .map((digit) => this.escapeRegExp(digit))
      .join('[^0-9]*')
  }

  private mergeRanges(ranges: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> {
    if (!ranges.length) {
      return []
    }

    const sorted = ranges.slice().sort((a, b) => a.start - b.start)
    const merged: Array<{ start: number; end: number }> = [sorted[0]!]

    sorted.slice(1).forEach((current) => {
      const last = merged[merged.length - 1]!

      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end)
        return
      }

      merged.push({ ...current })
    })

    return merged
  }

  groupSublineColumnsByParent<TItem>(
    columns: SearchModelDefinition<TItem>['columns'],
  ): Map<string, SearchColumnDefinition<TItem>[]> {
    const grouped = new Map<string, SearchColumnDefinition<TItem>[]>()

    columns.forEach((column) => {
      const parentKey = column.renderAsSublineOf
      if (!parentKey) {
        return
      }

      const current = grouped.get(parentKey) ?? []
      grouped.set(parentKey, [...current, column])
    })

    return grouped
  }

  sortRows<TItem extends object>(
    rows: TItem[],
    columns: SearchModelDefinition<TItem>['columns'],
    sortState: TableSortState,
    compareText: (a: string, b: string) => number,
    parseDate: (value: string) => Date | null,
  ): TItem[] {
    const column = columns.find((value) => value.key === sortState.key)
    const clonedRows = rows.slice()

    if (!column || column.sortable === false) {
      return clonedRows
    }

    clonedRows.sort((a, b) => {
      const read = (item: TItem): string => {
        if (column.accessor) {
          return String(column.accessor(item) ?? '')
        }

        return String(item[column.key as keyof TItem] ?? '')
      }

      const aValue = read(a)
      const bValue = read(b)

      if (column.key === 'date') {
        const aDate = parseDate(aValue)
        const bDate = parseDate(bValue)

        if (aDate && bDate) {
          const aTime = aDate.getTime()
          const bTime = bDate.getTime()
          return sortState.asc ? aTime - bTime : bTime - aTime
        }
      }

      return sortState.asc ? compareText(aValue, bValue) : compareText(bValue, aValue)
    })

    return clonedRows
  }

  shouldHighlightColumn<TItem>(
    key: string,
    fulltextTerms: string[],
    scopedKeys: string[],
    columns: SearchModelDefinition<TItem>['columns'],
  ): boolean {
    if (!fulltextTerms.length) {
      return false
    }

    if (!scopedKeys.length) {
      return true
    }

    const selectedSet = new Set(scopedKeys)
    const selectedColumns = columns.filter((column) => selectedSet.has(column.key))
    const groups = new Set(selectedColumns.map((column) => column.scopeGroup).filter(Boolean))

    if (selectedSet.has(key)) {
      return true
    }

    const current = columns.find((column) => column.key === key)
    if (!current?.scopeGroup) {
      return false
    }

    return groups.has(current.scopeGroup)
  }

  buildHighlightSegments(value: string, terms: string[]): HighlightSegment[] {
    const source = String(value ?? '')
    const normalizedTerms = Array.from(
      new Set(terms.map((term) => String(term || '').trim()).filter((term) => term.length > 0)),
    )

    if (!normalizedTerms.length) {
      return [{ text: source, highlighted: false }]
    }

    const pattern = normalizedTerms
      .slice()
      .sort((a, b) => b.length - a.length)
      .map((term) => this.buildTermPattern(term))
      .join('|')

    const regex = new RegExp(pattern, 'gi')
    const ranges: Array<{ start: number; end: number }> = []

    let match = regex.exec(source)
    while (match) {
      const matchedText = match[0] ?? ''
      if (matchedText.length > 0) {
        ranges.push({ start: match.index, end: match.index + matchedText.length })
      }

      if (matchedText.length === 0) {
        regex.lastIndex += 1
      }

      match = regex.exec(source)
    }

    if (!ranges.length) {
      return [{ text: source, highlighted: false }]
    }

    const merged = this.mergeRanges(ranges)
    const segments: HighlightSegment[] = []
    let cursor = 0

    merged.forEach((range) => {
      if (range.start > cursor) {
        segments.push({ text: source.slice(cursor, range.start), highlighted: false })
      }

      segments.push({ text: source.slice(range.start, range.end), highlighted: true })
      cursor = range.end
    })

    if (cursor < source.length) {
      segments.push({ text: source.slice(cursor), highlighted: false })
    }

    return segments
  }
}

export const tableSuggestPresenterService = new TableSuggestPresenterService()
