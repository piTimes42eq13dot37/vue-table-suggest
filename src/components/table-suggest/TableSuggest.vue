<script setup lang="ts" generic="TItem extends object">
import { computed, nextTick, ref, watch } from 'vue'
import { dateDomainService } from '../../lib/services/date-service'
import { buildSuggestions, filterItems, resolveEnglishLocale } from '../../lib/search-engine'
import type { SearchModelDefinition } from '../../lib/models/external'
import type { SearchToken } from '../../lib/models/internal'
import { formatGroupedNumber } from '../../lib/services/value-service'
import {
  tableSuggestPresenterService,
  type HighlightSegment,
} from '../../lib/services/table-suggest-presenter-service'

const props = defineProps<{
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
}>()

const query = ref('')
const selected = ref<SearchToken[]>([])
const resolveInitialSortKey = (): string =>
  props.modelDefinition.columns.find((column) => !column.renderAsSublineOf && column.sortable !== false)?.key ?? ''

const sortState = ref<{ key: string; asc: boolean }>({ key: resolveInitialSortKey(), asc: true })
const filterOptions = ref<SearchToken[]>([])
const qSelectRef = ref<{
  updateInputValue?: Function
  hidePopup?: () => void
} | null>(null)

const locale = computed(() => props.modelDefinition.locale ?? resolveEnglishLocale())
const textCollator = computed(
  () => new Intl.Collator(locale.value, { numeric: true, sensitivity: 'base' }),
)

const suggestions = computed(() =>
  buildSuggestions(props.items, props.modelDefinition, selected.value, query.value),
)

const visibleColumns = computed(() =>
  props.modelDefinition.columns.filter((column) => !column.renderAsSublineOf),
)

const sublineColumnsByParent = computed(() => {
  return tableSuggestPresenterService.groupSublineColumnsByParent(props.modelDefinition.columns)
})

const filtered = computed(() => filterItems(props.items, props.modelDefinition, selected.value))

const sortedRows = computed(() => {
  return tableSuggestPresenterService.sortRows(
    filtered.value,
    props.modelDefinition.columns,
    sortState.value,
    (a, b) => textCollator.value.compare(a, b),
    (value) => dateDomainService.parseDateInput(value),
  )
})

const fulltextTerms = computed(() =>
  selected.value.filter((token) => token.type === 'fulltext').map((token) => token.title),
)

const scopedKeys = computed(() =>
  selected.value.filter((token) => token.type === 'scope' && token.key).map((token) => token.key!),
)

const showHighlightForColumn = (key: string): boolean => {
  return tableSuggestPresenterService.shouldHighlightColumn(
    key,
    fulltextTerms.value,
    scopedKeys.value,
    props.modelDefinition.columns,
  )
}

const getColumnByKey = (key: string) => props.modelDefinition.columns.find((column) => column.key === key)

const getSublineColumns = (key: string) => sublineColumnsByParent.value.get(key) ?? []

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

  const normalizedValue = value.toLowerCase()
  const matchingSuggestion = buildSuggestions(
    props.items,
    props.modelDefinition,
    selected.value,
    value,
  ).find((token) => {
    if (!String(token.type).startsWith('date_')) return false
    return String(token.title || '').trim().toLowerCase() === normalizedValue
  })

  if (matchingSuggestion) {
    addToken(matchingSuggestion)
    return
  }

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
    date_before: 'Date before',
    date_after: 'Date after',
    date_exact: 'Date exact',
    date_relative: 'Date',
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
    props.modelDefinition.tokenDefaultColor ??
    'indigo-9'
  )
}

const chipColor = (token: SearchToken): string =>
  resolveTokenColor(token, props.modelDefinition.tokenColorByType)

const optionBadgeColor = (token: SearchToken): string =>
  resolveTokenColor(token, props.modelDefinition.optionBadgeColorByType, chipColor(token))

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
  return tableSuggestPresenterService.buildHighlightSegments(value, fulltextTerms.value)
}

const suggestionTitleSegments = (title: string): HighlightSegment[] =>
  tableSuggestPresenterService.buildHighlightSegments(title, [query.value])

const dateHint = (item: TItem): string => {
  const raw = renderCellValue(item, 'date')
  return dateDomainService.getDateMouseoverLabel(raw, locale.value)
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

