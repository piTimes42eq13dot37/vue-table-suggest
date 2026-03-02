import { defineModelDefinition, getModelDefinition } from '../lib/model-definition'
import { dateDomainService } from '../lib/services/date-service'
import type { SearchModelDefinition } from '../lib/models/external'

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

const getCurrentWeekDatesMondayFirst = (): Date[] => {
  const today = dateDomainService.startOfDay(new Date())
  const jsDay = today.getDay()
  const mondayOffset = (jsDay + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - mondayOffset)

  return Array.from({ length: 7 }, (_, idx) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + idx)
    return date
  })
}

const galacticWeekDates = getCurrentWeekDatesMondayFirst()

const snackManifestBase = [
  {
    hangarType: 'Orbital Locker Classic',
    hangarCode: '10000021304',
    id: 1,
    snackName: 'Galaxy Donut Prime',
    manifestNo: '123123',
    captainAlias: 'captain zebra',
    missionState: 'new',
  },
  {
    hangarType: 'Orbital Locker Deluxe',
    hangarCode: '123002350',
    id: 2,
    snackName: 'Galaxy Donut Prime',
    manifestNo: 'abc',
    captainAlias: 'captain mango',
    missionState: 'new',
  },
  {
    hangarType: 'Asteroid Vault Classic',
    hangarCode: '90800230001',
    id: 4,
    snackName: 'Nebula Noodle Beta',
    manifestNo: '0002',
    captainAlias: 'captain zebra',
    missionState: 'new',
  },
  {
    hangarType: 'Asteroid Vault Ultra',
    hangarCode: '120034500',
    id: 5,
    snackName: 'Comet Curry Gamma',
    manifestNo: '456456',
    captainAlias: 'captain lemon',
    missionState: 'new',
  },
  {
    hangarType: 'Moon Pantry Classic',
    hangarCode: '77889003456',
    id: 6,
    snackName: 'Moon Sprinkles Epsilon',
    manifestNo: '789',
    captainAlias: 'captain zebra',
    missionState: 'new',
  },
  {
    hangarType: 'Moon Pantry Ultra',
    hangarCode: '45600012003',
    id: 7,
    snackName: 'Moon Sprinkles Epsilon',
    manifestNo: '567890',
    captainAlias: 'captain zebra',
    missionState: 'new',
  },
  {
    hangarType: 'Orbital Locker Neon',
    hangarCode: '330004560001',
    id: 8,
    snackName: 'Star Sprinkles Epsilon',
    manifestNo: '920349293492394',
    captainAlias: 'captain zebra',
    missionState: 'revised',
  },
  {
    hangarType: 'Asteroid Vault Classic Plus',
    hangarCode: '7850023400',
    id: 9,
    snackName: 'Comet Curry Gamma',
    manifestNo: '99998',
    captainAlias: 'captain zebra',
    missionState: 'revised',
  },
  {
    hangarType: 'Moon Pantry Hyper',
    hangarCode: '990001230045',
    id: 10,
    snackName: 'Cosmic Cookie Nova',
    manifestNo: '2348658jk',
    captainAlias: 'captain zebra',
    missionState: 'revised',
  },
  {
    hangarType: 'Moon Pantry Hyper',
    hangarCode: '45234234234234',
    id: 11,
    snackName: 'Moon Sprinkles Epsilon',
    manifestNo: '567820',
    captainAlias: 'captain mango',
    missionState: 'new',
  },
] as const

export const demoModelDefinition = (): SearchModelDefinition<DemoItem> => getModelDefinition(DemoItem)

export const demoRows = (): DemoItem[] =>
  snackManifestBase.map((entry, index) => ({
    id: entry.id,
    product: entry.snackName,
    hangar: {
      type: entry.hangarType,
      number: entry.hangarCode,
    },
    number: entry.manifestNo,
    owner: entry.captainAlias,
    date: dateDomainService.formatDate(
      galacticWeekDates[index % galacticWeekDates.length] ?? galacticWeekDates[0] ?? new Date(),
    ),
    status: entry.missionState,
  }))
