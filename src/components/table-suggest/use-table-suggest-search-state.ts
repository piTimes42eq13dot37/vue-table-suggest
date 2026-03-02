import { computed, nextTick, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { buildSuggestions } from '../../lib/search-engine'
import type { SearchModelDefinition } from '../../lib/models/external'
import type { SearchToken } from '../../lib/models/search-token'

export type SelectInputUpdater = (value: string, noFilter?: boolean, keepInputValue?: boolean) => void
export type CreateValueDone = (value: null) => void
export type FilterUpdateHandler = (fn: () => void) => void

interface UseTableSuggestSearchStateInput<TItem extends object> {
  items: TItem[]
  modelDefinition: SearchModelDefinition<TItem>
}

interface UseTableSuggestSearchStateResult {
  query: Ref<string>
  selected: Ref<SearchToken[]>
  filterOptions: Ref<SearchToken[]>
  qSelectRef: Ref<{
    updateInputValue?: SelectInputUpdater
    hidePopup?: () => void
  } | null>
  fulltextTerms: Ref<string[]>
  scopedKeys: Ref<string[]>
  createValue: (value: string, done: CreateValueDone) => void
  filterFn: (value: string, update: FilterUpdateHandler) => void
}

export const useTableSuggestSearchState = <TItem extends object>(
  input: UseTableSuggestSearchStateInput<TItem>,
): UseTableSuggestSearchStateResult => {
  const query = ref('')
  const selected = ref<SearchToken[]>([])
  const filterOptions = ref<SearchToken[]>([])
  const qSelectRef = ref<{
    updateInputValue?: SelectInputUpdater
    hidePopup?: () => void
  } | null>(null)

  const suggestions = computed(() =>
    buildSuggestions(input.items, input.modelDefinition, selected.value, query.value),
  )

  const fulltextTerms = computed(() =>
    selected.value.filter((token) => token.type === 'fulltext').map((token) => token.title),
  )

  const scopedKeys = computed(() =>
    selected.value.filter((token) => token.type === 'scope' && token.key).map((token) => token.key!),
  )

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
      input.items,
      input.modelDefinition,
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

  const createValue = (value: string, done: CreateValueDone): void => {
    addQueryAsFulltext(value)
    done(null)
  }

  const filterFn = (value: string, update: FilterUpdateHandler): void => {
    update(() => {
      query.value = value
      filterOptions.value = suggestions.value.filter((option) => option.type !== 'fulltext')
    })
  }

  return {
    query,
    selected,
    filterOptions,
    qSelectRef,
    fulltextTerms,
    scopedKeys,
    createValue,
    filterFn,
  }
}
