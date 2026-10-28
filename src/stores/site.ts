import { reactive } from 'vue'
import axios from 'axios'
import { getApiBase } from '@/utils/config'

/**
 * Per-install branding, from the backend's `administration` single type
 * (GET /api/site-config). Lets one front build serve several sites
 * (e.g. Urban Resilience Research and Balkar).
 */
export interface SiteConfig {
  loaded: boolean
  siteName: string | null
  logoHeader: string | null
  logoFooter: string | null
  // Extra footer logos (partners), each with an optional link
  footerLogos: { image: string; url: string | null; alt: string }[]
  favicon: string | null
  styles: string | null
  defaultLocale: string | null
  // When false, '/' sends guests to the login page instead of the public catalogue.
  publicHome: boolean
  // Notification emails (NOTIFICATIONS_ENABLED on the backend): announcements, email settings
  notificationsEnabled: boolean
}

export const siteConfig = reactive<SiteConfig>({
  loaded: false,
  siteName: null,
  logoHeader: null,
  logoFooter: null,
  footerLogos: [],
  favicon: null,
  styles: null,
  defaultLocale: null,
  publicHome: true,
  notificationsEnabled: false
})

const absoluteUrl = (url: string | null) =>
  url && url.startsWith('/') ? `${getApiBase()}${url}` : url

const applyToDocument = () => {
  if (siteConfig.siteName) document.title = siteConfig.siteName
  if (siteConfig.favicon) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = siteConfig.favicon
  }
  if (siteConfig.styles) {
    // Global theme: overrides the --theme-* CSS variables of the default theme.
    let style = document.getElementById('site-theme-styles')
    if (!style) {
      style = document.createElement('style')
      style.id = 'site-theme-styles'
      document.head.appendChild(style)
    }
    style.textContent = siteConfig.styles
  }
}

export async function loadSiteConfig() {
  try {
    const { data } = await axios.get(`${getApiBase()}/api/site-config`)
    siteConfig.siteName = data.siteName || null
    siteConfig.logoHeader = absoluteUrl(data.logoHeader)
    siteConfig.logoFooter = absoluteUrl(data.logoFooter)
    siteConfig.footerLogos = (data.footerLogos || []).map((l: any) => ({
      image: absoluteUrl(l.image) as string,
      url: l.url,
      alt: l.alt || ''
    }))
    siteConfig.favicon = absoluteUrl(data.favicon)
    siteConfig.styles = data.styles || null
    siteConfig.defaultLocale = data.defaultLocale || null
    siteConfig.publicHome = data.publicHome !== false
    siteConfig.notificationsEnabled = data.notificationsEnabled === true
    applyToDocument()
  } catch (error) {
    // Older backends have no /site-config: keep the bundled defaults.
    console.warn('Could not load site config', error)
  }
  siteConfig.loaded = true
}
