import './assets/main.css'
import 'bootstrap'
import './assets/scss/custom.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';


// @ts-ignore
import { createI18n } from 'vue-i18n'

const app = createApp(App)


const i18n = createI18n({
    legacy: false,
    locale: 'ca',
    fallbackLocale: 'ca',
  })
  
  axios.get(import.meta.env.VITE_API_URL + '/translations?_limit=100')
  .then(response => {
    
    const translations = response.data
    const ca = translations.data.map((t: any) => ({ [t.attributes.key]: t.attributes.ca || t.attributes.caHtml })).reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {})
    const en = translations.data.map((t: any) => ({ [t.attributes.key]: t.attributes.en || t.attributes.enHtml })).reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {})

    i18n.global.setLocaleMessage('ca', ca);
    i18n.global.setLocaleMessage('en', en);

    
  })
  .catch(error => {
      console.error('Error loading locale messages:', error);
  });

app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
