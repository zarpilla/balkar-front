import service from '@/service/index'

const resource: string = 'applications'
export const applications = {
  get: () => service({ requiresAuth: false }).get(`${resource}/me/anonimous`),
  getAuth: () => service({ requiresAuth: true }).get(`${resource}/me/auth`)
}
