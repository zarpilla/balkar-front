import { defineStore } from 'pinia'
import { Api } from '@/service/api'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    loaded: false,    
    translations: {} as any,    
  }),
  actions: {
    async load() {
      if (!this.loaded) {
        const translations = await Api.translations.list()
        this.translations = translations.data.data.map((t: any) => ({ [t.attributes.key]: { ca: t.attributes.ca, en: t.attributes.en } })).reduce((acc: any, cur: any) => ({ ...acc, ...cur }), {})
        this.loaded = true
      }
      return
    },
  }
})
