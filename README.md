# vue-table-suggest
`vue-table-suggest` is a Vue 3 + TypeScript table search module with suggestion chips and date-aware filtering.

see [live demo](https://pitimes42eq13dot37.github.io/vue-table-suggest/)

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
- Uses seeded demo fixtures from `src/testing/demo-fixtures.ts`

There is also an external-consumer sample in `examples/consumer-app` that imports this package via
`file:../..` to validate real host-app integration.

CodePen is supported for quick external integration checks, but it is not the canonical demo for this project.

GitHub demo URL (after Pages is enabled):

- `https://<your-github-user>.github.io/<your-repo>/`

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
npm run watch
```

Then open the local Vite URL shown in the terminal.

## Scripts

- `npm run clean` - remove `dist`
- `npm run build:demo` - clean, type-check, and build only the app demo (GitHub Pages artifact)
- `npm run build` - clean, compile, and build app + library + codepen bundles
- `npm run test` - run `build`, typecheck, lint (`src` + `tests`), Vitest with coverage, then Playwright E2E
- `npm run watch` - start Vite dev server with local URL output
- `npm run check:cdn` - compare local `dist/lib` JS/CSS checksums against jsDelivr `@main`

## Architecture decisions

- **DDD boundaries**
  - `src/lib/models` contains value objects and domain parsing logic only.
  - `src/lib/services` contains application services and policy orchestration.
  - `src/components` stays presentational and delegates behavior to controller/presenter services.

- **Search engine contract + DI**
  - `createSearchEngine(...)` creates a fully wired search engine with overridable dependencies.
  - `searchEngine` is the default production instance; function exports are compatibility aliases.

- **Typed model definition API**
  - `createTypedModelDefinition<T>()` and `defineTypedModelDefinition(...)` add compile-time safety for column keys.
  - Custom keys are still supported when an explicit `accessor` is provided.

- **Policy configuration**
  - Suggestion scoring and relative-date thresholds are centralized via `defaultSuggestionPolicyConfig`.
  - `createSuggestionPolicies(...)` enables controlled tuning without touching service internals.

- **Import boundaries enforced by lint**
  - Models cannot import services/components.
  - Services cannot import components.
  - Components cannot import internal model-only modules.

## Publish demo on GitHub Pages

1. Push to `main`.
2. In GitHub repo settings, open `Pages` and set `Source` to `GitHub Actions`.
3. The workflow deploys the app demo automatically using `npm run build:demo`.
4. Open `https://<your-github-user>.github.io/<your-repo>/`.

## Test coverage notes

- `src/App.spec.ts` includes tooltip checks for:
  - depot number tooltip label (`Hangar Code`)
  - date tooltip rendering (`KW .. / year - weekday`)

## Reusing the module

`TableSuggest` stays presentational and receives all model behavior via model definition metadata.

```ts
import { defineModelDefinition, getModelDefinition } from 'vue-table-suggest'

class ItemModel {
  id = 0
  product = ''
  hangar = { type: '', number: '' }
  date = ''
}

defineModelDefinition(ItemModel, {
  modelName: 'ItemModel',
  locale: 'en-US',
  tokenColorByType: {
    fulltext: 'teal-9',
    scope: 'green-8',
    hangarCode: 'light-blue-9',
  },
  tokenTypeLabelByType: {
    fulltext: 'Anywhere',
    scope: 'In Column',
    date_relative: 'Date',
  },
  suggestionCategoryLabelByType: {
    scope: 'Search Scope',
    date_before: 'Before Date',
    date_after: 'After Date',
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

const modelDefinition = getModelDefinition(ItemModel)

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
import { TableSuggest, getModelDefinition } from 'vue-table-suggest'

const modelDefinition = getModelDefinition(ItemModel)
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
  <TableSuggest :items="items" :model-definition="modelDefinition" />
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

## Troubleshooting

- Sort direction icons are not visible:
  - Ensure Quasar icon assets are loaded in the host app entry:

```ts
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
```

  - Ensure `QIcon` is registered in your Quasar `components` list.
  - For CodePen, add the same Material Icons CSS as an external stylesheet resource.

- CodePen still shows old JS/CSS after a new build:
  - Keep using the same `@main` URL, but bump query params on each update (for both files), e.g. `?v=20260303-2`.
  - Optional purge endpoints, then reload CodePen Debug View:
    - `https://purge.jsdelivr.net/gh/piTimes42eq13dot37/vue-table-suggest@main/dist/lib/index.global.js`
    - `https://purge.jsdelivr.net/gh/piTimes42eq13dot37/vue-table-suggest@main/dist/lib/vue-table-suggest.css`
  - Verify local build equals CDN content using:

```bash
npm run check:cdn
```

  - `index.global.js: IDENTICAL` and `vue-table-suggest.css: IDENTICAL` means CDN is up to date.
  - `DIFFERENT` means your local build and CDN `@main` still differ.

## CodePen integration (optional)

Use these external resources only when you want to validate CDN-based integration in CodePen.

- CSS (top to bottom):
  - `https://cdn.jsdelivr.net/npm/quasar@2.18.5/dist/quasar.prod.css`
  - `https://cdn.jsdelivr.net/npm/@quasar/extras@1.17.0/material-icons/material-icons.css`
  - `https://cdn.jsdelivr.net/gh/piTimes42eq13dot37/vue-table-suggest@main/dist/lib/vue-table-suggest.css?v=20260303`

- JS (top to bottom):
  - `https://unpkg.com/vue@3/dist/vue.global.prod.js`
  - `https://cdn.jsdelivr.net/npm/quasar@2.18.5/dist/quasar.umd.prod.js`
  - `https://cdn.jsdelivr.net/gh/piTimes42eq13dot37/vue-table-suggest@main/dist/lib/index.global.js?v=20260303`

When you publish a new build and keep using `@main`, increase both `v=` values to force CodePen to fetch the new files.

For a complete typed example, use `examples/consumer-app/src/demo-model.ts` + `examples/consumer-app/src/demo-data.ts` as the template.
