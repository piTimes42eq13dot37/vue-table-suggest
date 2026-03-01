import type { App as VueApp, Plugin } from 'vue'
import TableSuggest from './components/table-suggest/TableSuggest.vue'

export const TableSuggestPlugin: Plugin = {
  install(app: VueApp) {
    app.component('TableSuggest', TableSuggest)
  },
}

export default TableSuggestPlugin
