import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import '@/assets/styles.scss'
import '@/assets/tailwind.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
})
app.use(i18n)
app.use(ConfirmationService)
app.use(ToastService)

app.mount('#app')
