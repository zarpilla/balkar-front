/**
 * Application configuration utilities
 */

// Type declaration for window.APP_CONFIG
declare global {
  interface Window {
    APP_CONFIG?: {
      API_BASE?: string;
    };
  }
}

/**
 * Get the API base URL from various sources in order of priority:
 * 1. window.APP_CONFIG.API_BASE (runtime config)
 * 2. import.meta.env.VITE_API_BASE (build-time env variable)
 * 3. 'http://localhost:1337' (fallback for development)
 */
export function getApiBase(): string {
  const windowConfig = window.APP_CONFIG?.API_BASE
  const viteEnv = import.meta.env.VITE_API_BASE
  const fallback = 'http://localhost:1337'
    
  return windowConfig || viteEnv || fallback
}

/**
 * Create a full URL by combining the API base with a relative path
 * @param path - The relative path to append to the API base
 * @returns The complete URL
 */
export function createApiUrl(path: string): string {
  const apiBase = getApiBase()
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${apiBase}/${cleanPath}`
}
