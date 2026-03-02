import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { defineComponent, h } from 'vue'
import TableSuggest from './TableSuggest.vue'
import { demoModelDefinition, demoRows } from '../../testing/demo-fixtures'

const QSelectStub = defineComponent({
  name: 'QSelect',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'new-value', 'filter'],
  methods: {
    removeAtIndex(index: number) {
      const next = [...(this.modelValue as unknown[])]
      next.splice(index, 1)
      this.$emit('update:modelValue', next)
    },
    selectOption(option: unknown) {
      this.$emit('update:modelValue', [...(this.modelValue as unknown[]), option])
    },
  },
  render() {
    const selected = (this.modelValue as unknown[]) || []
    const options = (this.options as unknown[]) || []

    return h('div', { class: 'q-select-stub' }, [
      h(
        'div',
        { class: 'q-select-selected' },
        selected.map((opt, index) =>
          this.$slots['selected-item']
            ? this.$slots['selected-item']({
                opt,
                index,
                removeAtIndex: (idx: number) => this.removeAtIndex(idx),
              })
            : null,
        ),
      ),
      h(
        'div',
        { class: 'q-select-options' },
        options.map((opt) =>
          this.$slots.option
            ? this.$slots.option({
                opt,
                itemProps: {
                  onClick: () => this.selectOption(opt),
                },
              })
            : null,
        ),
      ),
    ])
  },
})

const QChipStub = defineComponent({
  name: 'QChip',
  inheritAttrs: true,
  emits: ['remove'],
  setup(_, { emit, slots, attrs }) {
    return () =>
      h(
        'button',
        {
          class: 'chip',
          type: 'button',
          ...attrs,
          onClick: () => emit('remove'),
        },
        slots.default ? slots.default() : [],
      )
  },
})

const QItemStub = defineComponent({
  name: 'QItem',
  inheritAttrs: true,
  setup(_, { slots, attrs }) {
    return () => h('button', { class: 'suggest-item', type: 'button', ...attrs }, slots.default?.())
  },
})

const QItemSectionStub = defineComponent({
  name: 'QItemSection',
  setup(_, { slots }) {
    return () => h('div', {}, slots.default?.())
  },
})

const QItemLabelStub = defineComponent({
  name: 'QItemLabel',
  inheritAttrs: true,
  setup(_, { slots, attrs }) {
    return () => h('div', { ...attrs }, slots.default?.())
  },
})

const QIconStub = defineComponent({
  name: 'QIcon',
  inheritAttrs: true,
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('i', {
        ...attrs,
        class: ['q-icon', attrs.class],
        'data-name': props.name,
      })
  },
})

const QAvatarStub = defineComponent({
  name: 'QAvatar',
  inheritAttrs: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('span', {
        ...attrs,
        class: ['q-avatar', attrs.class],
        'data-icon': props.icon,
      })
  },
})

const mountTableSuggest = () =>
  mount(TableSuggest, {
    props: {
      items: demoRows() as unknown as object[],
      modelDefinition: demoModelDefinition() as unknown as {
        modelName: string
        columns: Array<{ key: string; label: string }>
      },
    },
    global: {
      stubs: {
        QSelect: QSelectStub,
        QChip: QChipStub,
        QItem: QItemStub,
        QItemSection: QItemSectionStub,
        QItemLabel: QItemLabelStub,
        QIcon: QIconStub,
        QAvatar: QAvatarStub,
      },
    },
  })

describe('TableSuggest', () => {
  it('renders q-select wrapper and original visible columns', () => {
    const wrapper = mountTableSuggest()

    expect(wrapper.findComponent({ name: 'QSelect' }).exists()).toBe(true)
    expect(wrapper.findAll('.q-icon').length).toBeGreaterThan(0)

    const headers = wrapper.findAll('th').map((th) => th.text())
    expect(headers).toEqual(['id', 'Snack', 'Hangar', 'Manifest', 'Captain', 'date', 'Mission State'])
  })

  it('shows sort icon and toggles direction on header click', async () => {
    const wrapper = mountTableSuggest()

    const idHeader = wrapper
      .findAll('th')
      .find((th) => th.text().includes('id'))

    expect(idHeader).toBeTruthy()
    expect(idHeader!.find('.sort-icon[data-name="arrow_upward"]').exists()).toBe(true)

    await idHeader!.trigger('click')
    await nextTick()

    expect(idHeader!.find('.sort-icon[data-name="arrow_downward"]').exists()).toBe(true)
  })

  it('keeps a stable sort icon slot in headers when toggling sort', async () => {
    const wrapper = mountTableSuggest()

    const idHeader = wrapper
      .findAll('th')
      .find((th) => th.text().includes('id'))
    const snackHeader = wrapper
      .findAll('th')
      .find((th) => th.text().includes('Snack'))

    expect(idHeader).toBeTruthy()
    expect(snackHeader).toBeTruthy()

    const slotsBefore = wrapper.findAll('th .sort-icon-slot')
    const iconsBefore = wrapper.findAll('th .sort-icon')
    expect(slotsBefore.length).toBe(wrapper.findAll('th').length)
    expect(iconsBefore.length).toBe(wrapper.findAll('th').length)

    expect(idHeader!.find('.sort-icon--hidden').exists()).toBe(false)
    expect(snackHeader!.find('.sort-icon--hidden').exists()).toBe(true)

    await snackHeader!.trigger('click')
    await nextTick()

    const slotsAfter = wrapper.findAll('th .sort-icon-slot')
    const iconsAfter = wrapper.findAll('th .sort-icon')
    expect(slotsAfter.length).toBe(slotsBefore.length)
    expect(iconsAfter.length).toBe(iconsBefore.length)

    expect(idHeader!.find('.sort-icon--hidden').exists()).toBe(true)
    expect(snackHeader!.find('.sort-icon--hidden').exists()).toBe(false)
  })

  it('shows initial sort icon on first sortable visible column when id is absent', () => {
    const modelDefinition = demoModelDefinition()
    const columnsWithoutId = modelDefinition.columns.filter((column) => column.key !== 'id')

    const wrapper = mount(TableSuggest, {
      props: {
        items: demoRows() as unknown as object[],
        modelDefinition: {
          ...modelDefinition,
          columns: columnsWithoutId,
        } as unknown as {
          modelName: string
          columns: Array<{ key: string; label: string }>
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const firstHeader = wrapper.findAll('th')[0]
    expect(firstHeader).toBeTruthy()
    expect(firstHeader!.find('.sort-icon[data-name="arrow_upward"]').exists()).toBe(true)
  })

  it('sorts numeric id values naturally instead of lexicographically', () => {
    const rows = [
      { id: 10, product: 'ten', date: '01.03.2026' },
      { id: 2, product: 'two', date: '28.02.2026' },
      { id: 1, product: 'one', date: '27.02.2026' },
    ]

    const wrapper = mount(TableSuggest, {
      props: {
        items: rows as unknown as object[],
        modelDefinition: {
          modelName: 'SortModel',
          columns: [
            { key: 'id', label: 'id', sortable: true, searchable: true },
            { key: 'product', label: 'Product', sortable: true, searchable: true },
            { key: 'date', label: 'date', sortable: true, searchable: true },
          ],
        } as unknown as {
          modelName: string
          columns: Array<{ key: string; label: string }>
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const ids = wrapper.findAll('tbody tr td:first-child').map((cell) => cell.text().trim())
    expect(ids).toEqual(['1', '2', '10'])
  })

  it('sorts date column correctly for dd.mm.yyyy and iso date values', async () => {
    const rows = [
      { id: 1, product: 'a', date: '2026-02-28' },
      { id: 2, product: 'b', date: '01.03.2026' },
      { id: 3, product: 'c', date: '2026-01-15' },
    ]

    const wrapper = mount(TableSuggest, {
      props: {
        items: rows as unknown as object[],
        modelDefinition: {
          modelName: 'DateSortModel',
          columns: [
            { key: 'id', label: 'id', sortable: true, searchable: true },
            { key: 'product', label: 'Product', sortable: true, searchable: true },
            { key: 'date', label: 'date', sortable: true, searchable: true },
          ],
        } as unknown as {
          modelName: string
          columns: Array<{ key: string; label: string }>
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const dateHeader = wrapper
      .findAll('th')
      .find((header) => header.text().includes('date'))

    expect(dateHeader).toBeTruthy()

    await dateHeader!.trigger('click')
    await nextTick()

    const ascDates = wrapper.findAll('tbody tr td:nth-child(3)').map((cell) => cell.text().trim())
    expect(ascDates).toEqual(['2026-01-15', '2026-02-28', '01.03.2026'])

    await dateHeader!.trigger('click')
    await nextTick()

    const descDates = wrapper.findAll('tbody tr td:nth-child(3)').map((cell) => cell.text().trim())
    expect(descDates).toEqual(['01.03.2026', '2026-02-28', '2026-01-15'])
  })

  it('adds a fulltext chip through q-select new-value event', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'alpha', () => undefined)
    await nextTick()

    expect(wrapper.text()).toContain('Full-Text:')
    expect(wrapper.text()).toContain('alpha')
  })

  it('uses configurable token type labels from model definition metadata', async () => {
    const modelDefinition = demoModelDefinition()

    const wrapper = mount(TableSuggest, {
      props: {
        items: demoRows() as unknown as object[],
        modelDefinition: {
          ...modelDefinition,
          tokenTypeLabelByType: {
            fulltext: 'Anywhere',
          },
        } as unknown as {
          modelName: string
          columns: Array<{ key: string; label: string }>
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'alpha', () => undefined)
    await nextTick()

    expect(wrapper.text()).toContain('Anywhere:')
    expect(wrapper.text()).not.toContain('Full-Text:')
  })

  it('uses In SubColumn chip label for scope tokens that target sub-columns', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('update:modelValue', [
      {
        uid: 'fulltext|21304',
        type: 'fulltext',
        title: '21304',
      },
      {
        uid: 'scope|hangarCode',
        type: 'scope',
        key: 'hangarCode',
        title: 'Hangar Code',
        category: 'Fulltext scope',
      },
    ])
    await nextTick()

    expect(wrapper.text()).toContain('In SubColumn:')
    expect(wrapper.text()).not.toContain('In Column:')
  })

  it('uses In SubColumn chip label for scope tokens targeting sub-columns even when key is missing', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('update:modelValue', [
      {
        uid: 'fulltext|235',
        type: 'fulltext',
        title: '235',
      },
      {
        uid: 'scope|hangarCode',
        type: 'scope',
        title: 'Hangar Code',
        category: 'Fulltext scope',
      },
    ])
    await nextTick()

    expect(wrapper.text()).toContain('In SubColumn:')
  })

  it('keeps In SubColumn when selecting Hangar Code scope suggestion from fulltext results', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', '235', () => undefined)
    await nextTick()

    select.vm.$emit('filter', '', (update: () => void) => update())
    await nextTick()

    const hangarCodeScopeSuggestion = wrapper
      .findAll('.suggest-item')
      .find((item) => item.text().includes('Hangar Code'))

    expect(hangarCodeScopeSuggestion).toBeTruthy()

    await hangarCodeScopeSuggestion!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('In SubColumn:')
    expect(wrapper.text()).toContain('Hangar Code')
  })

  it('keeps In Column chip label for non-sub-column scope tokens', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('update:modelValue', [
      {
        uid: 'fulltext|orbital',
        type: 'fulltext',
        title: 'orbital',
      },
      {
        uid: 'scope|hangar',
        type: 'scope',
        key: 'hangar',
        title: 'Hangar',
        category: 'Fulltext scope',
      },
    ])
    await nextTick()

    expect(wrapper.text()).toContain('In Column:')
  })

  it('uses configurable suggestion category labels from model definition metadata', async () => {
    const modelDefinition = demoModelDefinition()

    const wrapper = mount(TableSuggest, {
      props: {
        items: demoRows() as unknown as object[],
        modelDefinition: {
          ...modelDefinition,
          suggestionCategoryLabelByType: {
            scope: 'Search Scope',
          },
        } as unknown as {
          modelName: string
          columns: Array<{ key: string; label: string }>
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'moon', () => undefined)
    await nextTick()

    select.vm.$emit('filter', '', (update: () => void) => update())
    await nextTick()

    const suggestionMeta = wrapper.findAll('.suggest-meta').map((node) => node.text())
    expect(suggestionMeta.some((text) => text.includes('Search Scope'))).toBe(true)
  })

  it('shows parent sub-column category label for sub-column suggestions', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('filter', '21304', (update: () => void) => update())
    await nextTick()

    const suggestionMeta = wrapper.findAll('.suggest-meta').map((node) => node.text())
    expect(suggestionMeta.some((text) => text.includes('Hangar-SubColumn'))).toBe(true)
  })

  it('adds date-relative chip for after last tuesday when submitted by enter', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'after last tuesday', () => undefined)
    await nextTick()

    const chips = wrapper.findAll('.chip').map((chip) => chip.text().toLowerCase())
    expect(chips.some((text) => text.includes('date:') && text.includes('after last'))).toBe(true)
    expect(chips.some((text) => text.includes('full-text:') && text.includes('after last'))).toBe(false)
  })

  it('shows before monday suggestions as before last and before next', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('filter', 'before monday', (update: () => void) => update())
    await nextTick()

    const suggestionText = wrapper.findAll('.suggest-item').map((item) => item.text().toLowerCase())
    expect(suggestionText.some((text) => text.includes('before last monday'))).toBe(true)
    expect(suggestionText.some((text) => text.includes('before next monday'))).toBe(true)
  })

  it('highlights numeric query across grouped separators in suggestions', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('filter', '021304', (update: () => void) => update())
    await nextTick()

    const highlighted = wrapper.findAll('.suggest-title mark').map((node) => node.text())
    expect(highlighted.some((text) => text.includes('021.304'))).toBe(true)
  })

  it('highlights compact numeric query in grouped suggestions', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('filter', '213', (update: () => void) => update())
    await nextTick()

    const highlighted = wrapper.findAll('.suggest-title mark').map((node) => node.text())
    expect(highlighted.some((text) => text.includes('21.3'))).toBe(true)
  })

  it('renders grouped number display in table subline column', () => {
    const wrapper = mountTableSuggest()
    const firstSubline = wrapper.find('.subline-value')

    expect(firstSubline.exists()).toBe(true)
    expect(firstSubline.text()).toContain('10.000.021.304')
    expect(wrapper.text()).toContain('45.234.234.234.234')
  })

  it('renders date tooltip label in table', () => {
    const wrapper = mountTableSuggest()

    const dateTooltip = wrapper.find('span[title^="KW "]')
    expect(dateTooltip.exists()).toBe(true)
  })

  it('highlights fulltext matches in multiple columns when no scope is selected', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'moon', () => undefined)
    await nextTick()

    const productMarks = wrapper.findAll('tbody tr td:nth-child(2) mark')
    const depotMarks = wrapper.findAll('tbody tr td:nth-child(3) > div:first-child mark')

    expect(productMarks.length).toBeGreaterThan(0)
    expect(depotMarks.length).toBeGreaterThan(0)
  })

  it('keeps existing tags and replaces typed input context when clicking a suggestion', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'alpha', () => undefined)
    await nextTick()

    select.vm.$emit('filter', 'before monday', (update: () => void) => update())
    await nextTick()

    const optionsBefore = wrapper.findAll('.suggest-item')
    expect(optionsBefore.length).toBeGreaterThan(0)

    await optionsBefore[0]!.trigger('click')
    await nextTick()

    const chips = wrapper.findAll('.chip').map((chip) => chip.text().toLowerCase())
    expect(chips.some((text) => text.includes('full-text:') && text.includes('alpha'))).toBe(true)
    expect(chips.length).toBeGreaterThan(1)

    expect(wrapper.findAll('.suggest-item').length).toBe(0)
  })

  it('uses original default dynamic colors for chips and suggestion icons', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', 'donut', () => undefined)
    await nextTick()

    const fulltextChip = wrapper.find('.chip[color="teal-9"]')
    expect(fulltextChip.exists()).toBe(true)

    select.vm.$emit('filter', 'orbital', (update: () => void) => update())
    await nextTick()

    const defaultIconColor = wrapper.find('.suggest-icon[color="indigo-9"]')
    expect(defaultIconColor.exists()).toBe(true)
  })

  it('uses subcolumn default color for subline tokens', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('update:modelValue', [
      {
        uid: 'hangarCode|10000021304',
        type: 'hangarCode',
        key: 'hangarCode',
        title: '10000021304',
        category: 'Hangar Code',
        icon: 'pin',
      },
    ])
    await nextTick()

    expect(wrapper.find('.chip[color="light-blue-9"]').exists()).toBe(true)
  })

  it('supports overriding dynamic colors from model metadata', async () => {
    const wrapper = mount(TableSuggest, {
      props: {
        items: demoRows() as unknown as object[],
        modelDefinition: {
          ...(demoModelDefinition() as unknown as {
            modelName: string
            columns: Array<{ key: string; label: string }>
          }),
          tokenColorByType: {
            fulltext: 'amber-8',
          },
          tokenDefaultColor: 'grey-8',
        },
      },
      global: {
        stubs: {
          QSelect: QSelectStub,
          QChip: QChipStub,
          QItem: QItemStub,
          QItemSection: QItemSectionStub,
          QItemLabel: QItemLabelStub,
          QIcon: QIconStub,
          QAvatar: QAvatarStub,
        },
      },
    })

    const select = wrapper.findComponent({ name: 'QSelect' })
    select.vm.$emit('new-value', 'donut', () => undefined)
    await nextTick()
    expect(wrapper.find('.chip[color="amber-8"]').exists()).toBe(true)

    select.vm.$emit('filter', 'orbital', (update: () => void) => update())
    await nextTick()

    const options = wrapper.findAll('.suggest-item')
    expect(options.length).toBeGreaterThan(0)
    await options[0]!.trigger('click')
    await nextTick()

    expect(wrapper.find('.chip[color="grey-8"]').exists()).toBe(true)

  })

  it('ignores empty input when creating a fulltext token', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    select.vm.$emit('new-value', '   ', () => undefined)
    await nextTick()

    expect(wrapper.findAll('.chip').length).toBe(0)
  })

  it('deduplicates duplicate tokens emitted through model updates', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    const duplicate = {
      uid: 'fulltext|alpha',
      type: 'fulltext',
      title: 'alpha',
      category: 'Fulltext',
      icon: 'search',
    }

    select.vm.$emit('update:modelValue', [duplicate, duplicate])
    await nextTick()

    const chips = wrapper.findAll('.chip').map((chip) => chip.text())
    expect(chips.length).toBe(1)
    expect(chips[0]).toContain('alpha')
  })

  it('removes scope tokens when no fulltext token remains', async () => {
    const wrapper = mountTableSuggest()
    const select = wrapper.findComponent({ name: 'QSelect' })

    const scopeToken = {
      uid: 'scope|owner',
      type: 'scope',
      key: 'owner',
      title: 'owner',
      category: 'In Column',
      icon: 'arrow_right_alt',
    }

    select.vm.$emit('update:modelValue', [scopeToken])
    await nextTick()

    expect(wrapper.findAll('.chip').length).toBe(0)
  })
})
