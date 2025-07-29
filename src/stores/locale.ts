import { defineStore } from 'pinia'

export interface LocaleInfo {
  id: number
  name: string
  code: string
  createdAt: string
  updatedAt: string
  isDefault: boolean
}

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    availableLocales: [] as LocaleInfo[],
    loaded: false,
  }),
  getters: {
    getLocaleCodes: (state) => state.availableLocales.map(locale => locale.code),
    getLocaleByCode: (state) => (code: string) => state.availableLocales.find(locale => locale.code === code),
    getLocaleName: (state) => (code: string) => {
      const locale = state.availableLocales.find(l => l.code === code)
      return locale ? locale.name : code.toUpperCase()
    }
  },
  actions: {
    setAvailableLocales(locales: LocaleInfo[]) {
      this.availableLocales = locales
      this.loaded = true
    },
    getDefaultLocale() {
      return this.availableLocales.find(locale => locale.isDefault)
    }
  }
})
