import './assets/main.css'
import 'bootstrap'
import './assets/scss/custom.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vue3linkify from 'vue-3-linkify'
import { useLocaleStore } from '@/stores/locale'

// @ts-ignore
import { createI18n } from 'vue-i18n'

const app = createApp(App)

// Create Pinia instance first
const pinia = createPinia()
app.use(pinia)

// Get current locale from localStorage, default to 'en'
const currentLocale = localStorage.getItem('locale') || 'en'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: currentLocale,
  fallbackLocale: 'en',
  availableLocales: [] // Will be populated after loading locales
})

// First, get the list of available locales
axios
  .get(import.meta.env.VITE_API_URL + '/i18n/locales?_sort=name')
  .then((localesResponse) => {
    const availableLocales = localesResponse.data.map((locale: any) => locale.code)
    const localeData = localesResponse.data // Store full locale data with names

    // Store locale data in Pinia store
    const localeStore = useLocaleStore()
    localeStore.setAvailableLocales(localeData)

    // availableLocales is used by vue-i18n and the language switcher

    // Then load translations for all available locales
    return axios
      .get(
        import.meta.env.VITE_API_URL + '/translations?_limit=-1&locale=en&populate=localizations'
      )
      .then((response) => {
        const translations = response.data.data

        // Build translations for current locale only
        const localeTranslations: Record<string, string> = {}

        translations.forEach((translation: any) => {
          const mainKey = translation.attributes.key

          if (currentLocale === 'en') {
            // For English, use the main entry
            localeTranslations[mainKey] =
              translation.attributes.text || translation.attributes.textHtml
          } else {
            // For other locales, look in localizations.data
            const localization = translation.attributes.localizations?.data?.find(
              (loc: any) => loc.attributes.locale === currentLocale
            )

            if (localization) {
              localeTranslations[mainKey] =
                localization.attributes.text || localization.attributes.textHtml
            }
          }
        })

        // Set locale messages for all available locales
        availableLocales.forEach((locale: string) => {
          if (locale === currentLocale) {
            // Set translations for current locale
            i18n.global.setLocaleMessage(locale, localeTranslations)
          } else {
            // Set empty translations for other locales (they'll be loaded when switched)
            i18n.global.setLocaleMessage(locale, {})
          }
        })

        // Configure and mount the app after i18n is ready
        app.use(router)
        app.use(i18n)
        app.use(Vue3linkify)
        app.mount('#app')
      })
  })
  .catch((error) => {
    console.error('Error loading locales or translations:', error)

    // Fallback: just mount the app with basic i18n
    app.use(router)
    app.use(i18n)
    app.use(Vue3linkify)
    app.mount('#app')
  })
