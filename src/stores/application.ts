import { defineStore } from 'pinia'
import { Api } from '@/service/api'

export const useApplicationStore = defineStore('application', {
  state: () => ({
    loaded: false,    
    translations: {} as any,    
  }),
  actions: {
    async load(locale: string) {
      if (!this.loaded) {
        const translations = await Api.translations.list('en')
        
        // Build translations object using English keys but locale-specific values
        const translationsMap: Record<string, any> = {}
        
        translations.data.data.forEach((translation: any) => {
          const englishKey = translation.attributes.key
          
          if (locale === 'en') {
            // For English, use the main entry
            translationsMap[englishKey] = { 
              text: translation.attributes.text || translation.attributes.textHtml 
            }
          } else {
            // For other locales, look in localizations.data
            const localization = translation.attributes.localizations?.data?.find(
              (loc: any) => loc.attributes.locale === locale
            )
            
            if (localization) {
              translationsMap[englishKey] = { 
                text: localization.attributes.text || localization.attributes.textHtml 
              }
            } else {
              // Fallback to English if localization not found
              translationsMap[englishKey] = { 
                text: translation.attributes.text || translation.attributes.textHtml 
              }
            }
          }
        })
        
        this.translations = translationsMap
        this.loaded = true
      }
      return
    },
  }
})
