import { createApp } from 'vue'
import { QAvatar, QChip, QIcon, QItem, QItemLabel, QItemSection, QSelect, Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './style.css'
import App from './App.vue'

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
