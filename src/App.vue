<script setup lang="ts">
import TableSuggest from './components/table-suggest/TableSuggest.vue'
import { demoAnnotations } from './lib/demo-model'
import { demoRows } from './lib/demo-data'

const annotations = demoAnnotations()
const items = demoRows()

const examples = [
  'donut',
  'pantry',
  'captain',
  '2026-03-01',
  'after monday',
]
</script>

<template>
  <main class="app-root">
    <header class="intro">
      <h1>TableSuggest Demo</h1>
      <p>
        This demo renders a reusable table-search module with fulltext chips, scoped column chips,
        date-aware operators, and highlighted matches.
      </p>
      <ul>
        <li
          v-for="example in examples"
          :key="example"
        >
          Try: <code>{{ example }}</code>
        </li>
      </ul>
    </header>

    <TableSuggest
      :items="items"
      :annotations="annotations"
    />
  </main>
</template>

<style scoped>
.app-root {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
}

.intro {
  display: grid;
  gap: 8px;
}

h1 {
  font-size: 1.4rem;
  margin: 0;
}

p {
  margin: 0;
}

ul {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 4px;
}

code {
  font-size: 0.9em;
}
</style>
