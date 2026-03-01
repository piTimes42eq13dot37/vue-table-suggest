<script setup lang="ts" generic="TItem extends object">
import { computed, nextTick, ref, watch } from 'vue'
import { getDateMouseoverLabel, parseDateInput } from '../../lib/date'
import { buildSuggestions, filterItems, resolveEnglishLocale } from '../../lib/search-engine'
import type { SearchModelDefinition } from '../../lib/models/external'
import type { SearchToken } from '../../lib/models/internal'
import { formatGroupedNumber } from '../../lib/services/value-service'

const props = defineProps<{
  items: TItem[]
  annotations: SearchModelDefinition<TItem>
}>()

const query = ref('')
const selected = ref<SearchToken[]>([])
const resolveInitialSortKey = (): string =>
  props.annotations.columns.find((column) => !column.renderAsSublineOf && column.sortable !== false)?.key ?? ''

const sortState = ref<{ key: string; asc: boolean }>({ key: resolveInitialSortKey(), asc: true })
const filterOptions = ref<SearchToken[]>([])
const qSelectRef = ref<{
  updateInputValue?: Function
  hidePopup?: () => void
} | null>(null)

const locale = computed(() => props.annotations.locale ?? resolveEnglishLocale())
const textCollator = computed(
  () => new Intl.Collator(locale.value, { numeric: true, sensitivity: 'base' }),
)

const suggestions = computed(() =>
  buildSuggestions(props.items, props.annotations, selected.value, query.value),
)

const visibleColumns = computed(() =>
  props.annotations.columns.filter((column) => !column.renderAsSublineOf),
)

const sublineColumnsByParent = computed(() => {
  const grouped = new Map<string, typeof props.annotations.columns>()

  props.annotations.columns.forEach((column) => {
    const parentKey = column.renderAsSublineOf
    if (!parentKey) return

    const current = grouped.get(parentKey) ?? []
    grouped.set(parentKey, [...current, column])
  })

  return grouped
})

const filtered = computed(() => filterItems(props.items, props.annotations, selected.value))

const sortedRows = computed(() => {
  const column = props.annotations.columns.find((value) => value.key === sortState.value.key)
  const rows = filtered.value.slice()
  if (!column || column.sortable === false) return rows

  rows.sort((a, b) => {
    const read = (item: TItem): string => {
      if (column.accessor) return String(column.accessor(item) ?? '')
      return String(item[column.key as keyof TItem] ?? '')
    }

    const aValue = read(a)
    const bValue = read(b)

    if (column.key === 'date') {
      const aDate = parseDateInput(aValue)
      const bDate = parseDateInput(bValue)
      if (aDate && bDate) {
        const aTime = aDate.getTime()
        const bTime = bDate.getTime()
        return sortState.value.asc ? aTime - bTime : bTime - aTime
      }
    }

    return sortState.value.asc
      ? textCollator.value.compare(aValue, bValue)
      : textCollator.value.compare(bValue, aValue)
  })

  return rows
})

const fulltextTerms = computed(() =>
  selected.value.filter((token) => token.type === 'fulltext').map((token) => token.title),
)

const scopedKeys = computed(() =>
  selected.value.filter((token) => token.type === 'scope' && token.key).map((token) => token.key!),
)

const showHighlightForColumn = (key: string): boolean => {
  if (!fulltextTerms.value.length) return false
  if (!scopedKeys.value.length) return true

  const selectedSet = new Set(scopedKeys.value)
  const selectedColumns = props.annotations.columns.filter((column) => selectedSet.has(column.key))
  const groups = new Set(selectedColumns.map((column) => column.scopeGroup).filter(Boolean))

  if (selectedSet.has(key)) return true
  const current = props.annotations.columns.find((column) => column.key === key)
  if (!current?.scopeGroup) return false
  return groups.has(current.scopeGroup)
}

const getColumnByKey = (key: string) => props.annotations.columns.find((column) => column.key === key)

const getSublineColumns = (key: string) => sublineColumnsByParent.value.get(key) ?? []

interface HighlightSegment {
  text: string
  highlighted: boolean
}

const escapeRegExp = (value: string): string =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizeDigits = (value: string): string => String(value || '').replace(/[^0-9]/g, '')

const buildTermPattern = (term: string): string => {
  const normalized = normalizeDigits(term)
  const isDigitsOnly = normalized.length > 0 && normalized === term

  if (!isDigitsOnly) {
    return escapeRegExp(term)
  }

  return normalized
    .split('')
    .map((digit) => escapeRegExp(digit))
    .join('[^0-9]*')
}

const mergeRanges = (ranges: Array<{ start: number; end: number }>): Array<{ start: number; end: number }> => {
  if (!ranges.length) return []

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

const buildHighlightSegments = (value: string, terms: string[]): HighlightSegment[] => {
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
    .map((term) => buildTermPattern(term))
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

  const merged = mergeRanges(ranges)
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

const renderCellValue = (item: TItem, key: string): string => {
  const column = getColumnByKey(key)
  const toDisplay = (raw: unknown): string => {
    if (column?.valueType === 'number-like') {
      return formatGroupedNumber(raw)
    }
    return String(raw ?? '')
  }

  if (column?.accessor) {
    return toDisplay(column.accessor(item))
  }

  const data = item as Record<string, unknown>
  return toDisplay(data[key])
}

const addToken = (token: SearchToken): void => {
  if (selected.value.some((entry) => entry.uid === token.uid)) {
    query.value = ''
    filterOptions.value = []
    return
  }
  selected.value = [...selected.value, token]
  query.value = ''
  filterOptions.value = []
}

watch(selected, (current) => {
  const deduped = current.filter(
    (token, index, array) => array.findIndex((value) => value.uid === token.uid) === index,
  )
  if (deduped.length !== current.length) {
    selected.value = deduped
    return
  }

  const hasFulltext = current.some((value) => value.type === 'fulltext')
  if (!hasFulltext && current.some((value) => value.type === 'scope')) {
    selected.value = current.filter((value) => value.type !== 'scope')
    return
  }

  query.value = ''
  filterOptions.value = []

  void nextTick(() => {
    qSelectRef.value?.updateInputValue?.('', true, true)
    qSelectRef.value?.hidePopup?.()
  })
})

const addQueryAsFulltext = (rawValue: string): void => {
  const value = String(rawValue || '').trim()
  if (!value) return
  addToken({
    uid: `fulltext|${value}`,
    type: 'fulltext',
    title: value,
    category: 'Fulltext',
    icon: 'search',
  })
}

const chipTypeLabel = (token: SearchToken): string => {
  const map: Record<string, string> = {
    date_before: 'Stardate before',
    date_after: 'Stardate after',
    date_exact: 'Stardate exact',
    date_relative: 'Stardate',
    fulltext: 'Full-Text',
    scope: 'In Column',
  }

  const mappedLabel = map[token.type]
  if (mappedLabel) return mappedLabel
  const key = token.key ?? token.type
  const column = getColumnByKey(key)
  return column?.label ?? token.category ?? token.type
}

const defaultTokenColorByType: Record<string, string> = {
  fulltext: 'teal-9',
  scope: 'green-8',
  subcolumn: 'light-blue-9',
}

const resolveDefaultTokenColor = (token: SearchToken): string | undefined => {
  if (defaultTokenColorByType[token.type]) return defaultTokenColorByType[token.type]

  const key = token.key ?? token.type
  const column = getColumnByKey(key)
  if (column?.renderAsSublineOf) {
    return defaultTokenColorByType.subcolumn
  }

  return undefined
}

const resolveTokenColor = (
  token: SearchToken,
  colorByType?: Record<string, string>,
  fallback?: string,
): string => {
  return (
    colorByType?.[token.type] ??
    resolveDefaultTokenColor(token) ??
    fallback ??
    props.annotations.tokenDefaultColor ??
    'indigo-9'
  )
}

const chipColor = (token: SearchToken): string =>
  resolveTokenColor(token, props.annotations.tokenColorByType)

const optionBadgeColor = (token: SearchToken): string =>
  resolveTokenColor(token, props.annotations.optionBadgeColorByType, chipColor(token))

const createValue = (value: string, done: Function): void => {
  addQueryAsFulltext(value)
  done(null)
}

const filterFn = (value: string, update: Function): void => {
  update(() => {
    query.value = value
    filterOptions.value = suggestions.value.filter((option: SearchToken) => option.type !== 'fulltext')
  })
}

const getTooltip = (item: TItem, key: string): string => {
  const column = getColumnByKey(key)
  if (!column?.tooltipHint) return ''
  if (typeof column.tooltipHint === 'function') return column.tooltipHint(item)
  return column.tooltipHint
}

const toggleSort = (key: string): void => {
  const column = getColumnByKey(key)
  if (column?.sortable === false) return

  if (sortState.value.key !== key) {
    sortState.value = { key, asc: true }
    return
  }
  sortState.value = { key, asc: !sortState.value.asc }
}

const sortIcon = (key: string): string | null => {
  if (sortState.value.key !== key) return null
  return sortState.value.asc ? 'arrow_upward' : 'arrow_downward'
}

const cellSegments = (item: TItem, key: string): HighlightSegment[] => {
  const value = renderCellValue(item, key)
  if (!showHighlightForColumn(key)) return [{ text: value, highlighted: false }]
  return buildHighlightSegments(value, fulltextTerms.value)
}

const suggestionTitleSegments = (title: string): HighlightSegment[] =>
  buildHighlightSegments(title, [query.value])

const dateHint = (item: TItem): string => {
  const raw = renderCellValue(item, 'date')
  return getDateMouseoverLabel(raw, locale.value)
}
</script>

<template>
  <div class="table-suggest">
    <div class="search-wrap">
      <q-select
        ref="qSelectRef"
        v-model="selected"
        class="search-field"
        input-class="search-input"
        label="Search"
        use-input
        use-chips
        multiple
        input-debounce="0"
        option-label="title"
        option-value="uid"
        :options="filterOptions"
        @new-value="createValue"
        @filter="filterFn"
      >
        <template #selected-item="scope">
          <q-chip
            removable
            dense
            class="chip"
            :color="chipColor(scope.opt)"
            text-color="white"
            @remove="scope.removeAtIndex(scope.index)"
          >
            <q-avatar
              v-if="scope.opt.icon"
              color="white"
              :text-color="chipColor(scope.opt)"
              :icon="scope.opt.icon"
            />
            <span>{{ chipTypeLabel(scope.opt) }}:</span>
            <span>{{ scope.opt.title }}</span>
          </q-chip>
        </template>

        <template #option="scope">
          <q-item
            v-if="scope.opt.type !== 'fulltext'"
            v-bind="scope.itemProps"
            class="suggest-item"
          >
            <q-item-section>
              <q-item-label class="suggest-title">
                <template
                  v-for="(segment, index) in suggestionTitleSegments(scope.opt.title)"
                  :key="`${scope.opt.uid}-title-${index}`"
                >
                  <mark v-if="segment.highlighted">{{ segment.text }}</mark>
                  <template v-else>
                    {{ segment.text }}
                  </template>
                </template>
              </q-item-label>
              <q-item-label
                caption
                class="suggest-meta"
              >
                <q-icon
                  v-if="scope.opt.icon"
                  :name="scope.opt.icon"
                  :color="optionBadgeColor(scope.opt)"
                  size="14px"
                  class="suggest-icon"
                />
                {{ scope.opt.category }}<span v-if="(scope.opt.matchCount ?? 0) > 0"> - {{ scope.opt.matchCount }} x</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <table class="data-table">
      <colgroup>
        <col
          v-for="column in visibleColumns"
          :key="`col-${column.key}`"
          :style="column.key === 'id' ? { width: '9ch' } : undefined"
        >
      </colgroup>
      <thead>
        <tr>
          <th
            v-for="column in visibleColumns"
            :key="column.key"
            @click="toggleSort(column.key)"
          >
            <q-icon
              v-if="column.icon"
              :name="column.icon"
              size="16px"
              class="header-icon"
            />
            <span>{{ column.label }}</span>
            <span class="sort-icon-slot">
              <q-icon
                :name="sortIcon(column.key) ?? 'arrow_upward'"
                size="14px"
                class="sort-icon"
                :class="{ 'sort-icon--hidden': !sortIcon(column.key) }"
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in sortedRows"
          :key="index"
        >
          <td
            v-for="column in visibleColumns"
            :key="column.key"
          >
            <template v-if="getSublineColumns(column.key).length > 0">
              <div>
                <template
                  v-for="(segment, segmentIndex) in cellSegments(item, column.key)"
                  :key="`${column.key}-${index}-${segmentIndex}`"
                >
                  <mark v-if="segment.highlighted">{{ segment.text }}</mark>
                  <template v-else>
                    {{ segment.text }}
                  </template>
                </template>
              </div>
              <span
                v-for="sublineColumn in getSublineColumns(column.key)"
                :key="`${column.key}-${sublineColumn.key}-${index}`"
                class="subline-value"
                :title="getTooltip(item, sublineColumn.key)"
              >
                <span>
                  <template
                    v-for="(segment, segmentIndex) in cellSegments(item, sublineColumn.key)"
                    :key="`${sublineColumn.key}-${index}-${segmentIndex}`"
                  >
                    <mark v-if="segment.highlighted">{{ segment.text }}</mark>
                    <template v-else>{{ segment.text }}</template>
                  </template>
                </span>
              </span>
            </template>
            <span
              v-else-if="column.key === 'date'"
              :title="dateHint(item)"
            >
              <template
                v-for="(segment, segmentIndex) in cellSegments(item, column.key)"
                :key="`date-${index}-${segmentIndex}`"
              >
                <mark v-if="segment.highlighted">{{ segment.text }}</mark>
                <template v-else>{{ segment.text }}</template>
              </template>
            </span>
            <span
              v-else
              :title="getTooltip(item, column.key)"
            >
              <template
                v-for="(segment, segmentIndex) in cellSegments(item, column.key)"
                :key="`${column.key}-${index}-${segmentIndex}`"
              >
                <mark v-if="segment.highlighted">{{ segment.text }}</mark>
                <template v-else>{{ segment.text }}</template>
              </template>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-suggest {
  display: grid;
  gap: 12px;
}

.search-wrap {
  position: relative;
}

.search-field {
  width: 100%;
}

:deep(.search-field .q-field__append) {
  display: none;
}

.search-input {
  font-size: 14px;
}

.chip-icon {
  margin-right: 4px;
}

.suggest-item {
  min-height: 48px;
}

.suggest-meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #405166;
}

.suggest-icon {
  opacity: 0.85;
}

.data-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.data-table th,
.data-table td {
  border: 1px solid #d9dfe8;
  padding: 8px;
  height: 40px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

.data-table th {
  cursor: pointer;
  background: #f7f9fc;
}

.header-icon {
  margin-right: 4px;
  vertical-align: text-bottom;
}

.sort-icon {
  vertical-align: text-bottom;
}

.sort-icon-slot {
  display: inline-flex;
  width: 14px;
  margin-left: 4px;
  justify-content: center;
}

.sort-icon--hidden {
  visibility: hidden;
}

.subline-value {
  display: inline-block;
  margin-left: 6px;
}

:deep(mark) {
  background: #ffb300;
  color: #111827;
}
</style>
