import { createApp } from 'vue'
import { QAvatar, QChip, QIcon, QItem, QItemLabel, QItemSection, QSelect, Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import 'vue-table-suggest/style.css'
import './style.css'
import App from './App.vue'

const warnIfMaterialIconsMissing = (): void => {
  const probe = document.createElement('span')
  probe.className = 'material-icons'
  probe.textContent = 'arrow_upward'
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none'
  document.body.appendChild(probe)

  const fontFamily = window.getComputedStyle(probe).fontFamily || ''
  probe.remove()

  if (!/material icons/i.test(fontFamily)) {
    console.warn(
      '[vue-table-suggest] Quasar icons are not available. Import "@quasar/extras/material-icons/material-icons.css" in your app entry to display sort and column icons.',
    )
  }
}

createApp(App)
  .use(Quasar, {
    components: {
      QSelect,
      QChip,
      QAvatar,
      QIcon,
      QItem,
      QItemSection,
      QItemLabel,
    },
  })
  .mount('#app')

if (import.meta.env.DEV) {
  requestAnimationFrame(() => warnIfMaterialIconsMissing())
}
