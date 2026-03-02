import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import App from './App.vue'

const QSelectStub = defineComponent({
  name: 'QSelect',
  setup(_, { slots }) {
    return () => h('div', { class: 'q-select-stub' }, [slots.default?.()])
  },
})

const QChipStub = defineComponent({
  name: 'QChip',
  setup(_, { slots }) {
    return () => h('div', { class: 'chip' }, slots.default?.())
  },
})

const QItemStub = defineComponent({
  name: 'QItem',
  setup(_, { slots }) {
    return () => h('div', { class: 'suggest-item' }, slots.default?.())
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
  setup(_, { slots }) {
    return () => h('div', {}, slots.default?.())
  },
})

const QIconStub = defineComponent({
  name: 'QIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => h('i', { class: 'q-icon', 'data-name': props.name })
  },
})

const QAvatarStub = defineComponent({
  name: 'QAvatar',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return () => h('span', { class: 'q-avatar', 'data-icon': props.icon })
  },
})

const mountApp = () =>
  mount(App, {
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

describe('App', () => {
  it('renders demo title', () => {
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('TableSuggest Demo')
  })

  it('renders demo guidance', () => {
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('Try: before monday')
    expect(wrapper.text()).toContain('Try: 2026-03-01')
    expect(wrapper.text()).toContain('Try: after monday')
    expect(wrapper.text()).toContain('Try: last monday')
    expect(wrapper.text()).toContain('Try: donut')
  })

  it('renders seeded table row content', () => {
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('Orbital Locker Classic')
  })

  it('renders grouped hangar code format in subline table cell', () => {
    const wrapper = mountApp()
    expect(wrapper.text()).toContain('10.000.021.304')
    expect(wrapper.text()).toContain('45.234.234.234.234')
    expect(wrapper.text()).not.toContain('10000021304')
    expect(wrapper.text()).not.toContain('45234234234234')
  })

  it('renders subline and date tooltips in the table', () => {
    const wrapper = mountApp()

    const sublineTooltip = wrapper.find('.subline-value')
    expect(sublineTooltip.exists()).toBe(true)
    expect(sublineTooltip.attributes('title')).toBe('Hangar Code')

    const dateTooltip = wrapper.find('span[title^="KW "]')
    expect(dateTooltip.exists()).toBe(true)
  })
})
