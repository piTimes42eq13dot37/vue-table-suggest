<script setup lang="ts" generic="TItem extends object">
import type { SearchModelDefinition } from '../../lib/models/external'
import { useTableSuggestController } from './use-table-suggest-controller'

const props = defineProps<{
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
}>()

const {
  selected,
  filterOptions,
  qSelectRef,
  visibleColumns,
  sortedRows,
  getSublineColumns,
  createValue,
  filterFn,
  chipColor,
  chipTypeLabel,
  optionBadgeColor,
  suggestionCategoryLabel,
  suggestionTitleSegments,
  toggleSort,
  sortIcon,
  cellSegments,
  dateHint,
  getTooltip,
} = useTableSuggestController(props)

void qSelectRef
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
                {{ suggestionCategoryLabel(scope.opt) }}<span v-if="(scope.opt.matchCount ?? 0) > 0"> - {{ scope.opt.matchCount }} x</span>
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

