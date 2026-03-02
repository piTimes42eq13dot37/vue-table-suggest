<script setup lang="ts">
import { TableSuggest, defineModelDefinition, getModelDefinition } from 'vue-table-suggest'

class ShipmentItem {
  id = 0
  product = ''
  hangar = { type: '', number: '' }
  date = ''
}

defineModelDefinition(ShipmentItem, {
  modelName: 'ShipmentItem',
  locale: 'en-US',
  columns: [
    { key: 'id', label: 'ID', sortable: true, searchable: true },
    { key: 'product', label: 'Product', sortable: true, searchable: true },
    {
      key: 'hangar',
      label: 'Hangar',
      sortable: true,
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.type,
    },
    {
      key: 'hangarCode',
      label: 'Hangar Code',
      sortable: false,
      searchable: true,
      scopeGroup: 'hangar',
      accessor: (item) => item.hangar.number,
      valueType: 'number-like',
      renderAsSublineOf: 'hangar',
      tooltipHint: 'Hangar Code',
    },
    { key: 'date', label: 'Date', sortable: true, searchable: true },
  ],
})

const modelDefinition = getModelDefinition(ShipmentItem)

const items: ShipmentItem[] = [
  {
    id: 1,
    product: 'Galaxy Donut Prime',
    hangar: { type: 'Orbital Locker Classic', number: '10000021304' },
    date: '2026-02-28',
  },
  {
    id: 2,
    product: 'Moon Cookie Delta',
    hangar: { type: 'Moon Pantry Hyper', number: '45234234234234' },
    date: '2026-03-01',
  },
]
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
