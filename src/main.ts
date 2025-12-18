import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

import { Quasar, Dialog } from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import { router } from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router) 

app.use(Quasar, {
  plugins: {
    Dialog
  }, 
})

app.mount('#app')