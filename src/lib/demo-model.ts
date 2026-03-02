import { defineModelDefinition, getModelDefinition } from './model-definition'
import { dateDomainService } from './services/date-service'
import type { SearchModelDefinition } from './models/external'

export class DemoItem {
  id = 0
  product = ''
  hangar: { type: string; number: string } = { type: '', number: '' }
  number = ''
  owner = ''
  date = ''
  status = ''
}

const locale =
  (typeof globalThis !== 'undefined' &&
    typeof globalThis.navigator !== 'undefined' &&
    Array.isArray(globalThis.navigator.languages) &&
    globalThis.navigator.languages.find((lang) => String(lang).toLowerCase().startsWith('en'))) ||
  'en-US'

const modelDefinition: SearchModelDefinition<DemoItem> = {
  modelName: 'DemoItem',
  locale,
  maxSuggestions: 7,
  maxWeekdaySuggestions: 4,
  columns: [
    { key: 'id', label: 'id', icon: 'tag', sortable: true, searchable: true },
    { key: 'product', label: 'Snack', icon: 'category', sortable: true, searchable: true },
    {
      key: 'hangar',
      label: 'Hangar',
      icon: 'article',
      sortable: true,
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.type,
    },
    {
      key: 'hangarCode',
      label: 'Hangar Code',
      icon: 'pin',
      sortable: false,
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.number,
      tooltipHint: 'Hangar Code',
      valueType: 'number-like',
      renderAsSublineOf: 'hangar',
    },
    { key: 'number', label: 'Manifest', icon: 'pin', sortable: true, searchable: true },
    { key: 'owner', label: 'Captain', icon: 'badge', sortable: true, searchable: true },
    {
      key: 'date',
      label: 'date',
      icon: 'event',
      sortable: true,
      searchable: true,
      tooltipHint: (item) => dateDomainService.getDateMouseoverLabel(item.date, locale),
    },
    { key: 'status', label: 'Mission State', icon: 'task_alt', sortable: true, searchable: true },
  ],
}

defineModelDefinition(DemoItem, modelDefinition)

export const demoModelDefinition = (): SearchModelDefinition<DemoItem> => getModelDefinition(DemoItem)
