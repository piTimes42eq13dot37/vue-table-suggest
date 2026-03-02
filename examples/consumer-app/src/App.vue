<script setup lang="ts">
import { TableSuggest } from 'vue-table-suggest'
import { demoModelDefinition } from './demo-model'
import { demoRows } from './demo-data'

const modelDefinition = demoModelDefinition()
const items = demoRows()
</script>

<template>
  <main class="app-root">
    <h1>Consumer App Example</h1>
    <TableSuggest
      :items="items"
      :model-definition="modelDefinition"
    />
  </main>
</template>

<style scoped>
.app-root {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
}
</style>
