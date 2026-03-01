# vue-table-suggest

`vue-table-suggest` is a Vue 3 + TypeScript table search module with suggestion chips and date-aware filtering.

## Use in another Vue project

Install from a local path or published package:

```bash
npm i vue-table-suggest
```

This library expects the host app to provide Vue 3 + Quasar.

Example host setup:

```ts
import { createApp } from 'vue'
import { Quasar, QAvatar, QChip, QIcon, QItem, QItemLabel, QItemSection, QSelect } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'vue-table-suggest/style.css'
import App from './App.vue'

createApp(App)
  .use(Quasar, {
    components: { QSelect, QChip, QAvatar, QIcon, QItem, QItemSection, QItemLabel },
  })
  .mount('#app')
```

## Demo in this repo

The app in `src/App.vue` is a complete working demo of the module.

- Uses `TableSuggest` from `src/components/table-suggest/TableSuggest.vue`
- Uses seeded demo rows from `src/lib/demo-data.ts`
- Uses strongly typed column/search metadata from `src/lib/demo-model.ts`

There is also an external-consumer sample in `examples/consumer-app` that imports this package via
`file:../..` to validate real host-app integration.

When you run the app, you can try these demo searches in the input:

- `donut`
- `pantry`
- `captain`
- `date before 2026-03-01`
- `date after last monday`

## Demo behavior

- Press `Enter` to add current text as a fulltext chip.
- Click a suggestion to add it as a chip.
- Click a chip to remove it.
- Click column headers to toggle sorting.
- Matching text is highlighted in table cells.
- Date hints/tooltips are generated from the configured locale.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - typecheck + production build
- `npm run build:lib` - build library bundle + type declarations for external consumption
- `npm run preview` - preview production build
- `npm run test` - run Vitest once
- `npm run test:coverage` - run tests with coverage thresholds (fails below threshold)
- `npm run test:watch` - run Vitest in watch mode
- `npm run lint` - run ESLint
- `npm run typecheck` - run type checking only

## Test coverage notes

- `src/App.spec.ts` includes tooltip checks for:
  - depot number tooltip label (`Hangar Code`)
  - date tooltip rendering (`KW .. / year - weekday`)

## Reusing the module

`TableSuggest` stays presentational and receives all model behavior via annotations.

```ts
import { defineModelAnnotations, getModelAnnotations } from 'vue-table-suggest'

class ItemModel {
  id = 0
  product = ''
  hangar = { type: '', number: '' }
  date = ''
}

defineModelAnnotations(ItemModel, {
  modelName: 'ItemModel',
  locale: 'en-US',
  tokenColorByType: {
    fulltext: 'teal-9',
    scope: 'green-8',
    hangarCode: 'light-blue-9',
  },
  optionBadgeColorByType: {
    fulltext: 'teal-9',
    scope: 'green-8',
    hangarCode: 'light-blue-9',
  },
  tokenDefaultColor: 'indigo-9',
  columns: [
    { key: 'id', label: 'ID', searchable: true, sortable: true },
    { key: 'product', label: 'Product', searchable: true, sortable: true },
    {
      key: 'hangar',
      label: 'Hangar Type',
      searchable: true,
      sortable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.type,
    },
    {
      key: 'hangarCode',
      label: 'Hangar Code',
      searchable: true,
      sortable: false,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.number,
    },
    { key: 'date', label: 'Date', searchable: true, sortable: true },
  ],
})

const annotations = getModelAnnotations(ItemModel)

const items: ItemModel[] = [
  {
    id: 1,
    product: 'Galaxy Donut Prime',
    hangar: { type: 'Orbital Locker Classic', number: '10000021304' },
    date: '2026-02-28',
  },
]
```

```vue
<script setup lang="ts">
import { TableSuggest, getModelAnnotations } from 'vue-table-suggest'

const annotations = getModelAnnotations(ItemModel)
const items: ItemModel[] = [
  {
    id: 1,
    product: 'Galaxy Donut Prime',
    hangar: { type: 'Orbital Locker Classic', number: '10000021304' },
    date: '2026-02-28',
  },
]
</script>

<template>
  <TableSuggest :items="items" :annotations="annotations" />
</template>
```

Or register globally via plugin:

```ts
import { createApp } from 'vue'
import TableSuggestPlugin from 'vue-table-suggest'

createApp(App).use(TableSuggestPlugin).mount('#app')
```

If you also need component styles in an external app, import:

```ts
import 'vue-table-suggest/style.css'
```

For a complete typed example, use `src/lib/demo-model.ts` + `src/lib/demo-data.ts` as the template.
