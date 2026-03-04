import type { App, Plugin } from 'vue'
import TableSuggest from './components/table-suggest/TableSuggest.vue'

export const TableSuggestPlugin: Plugin = {
  install(app: App) {
    app.component('TableSuggest', TableSuggest)
  },
}

export default TableSuggestPlugin
