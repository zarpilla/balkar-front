import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'learning-spaces'
export const learningSpaces = {
  ...CreateBaseApiService(resource),
  get: (id: string, locale: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}?locale=${locale}`),
  mine: (locale: string) => service({ requiresAuth: true }).get(`${resource}/mine?locale=${locale}`),
  getAdminUsersProgress: (uid: string) => service({ requiresAuth: true }).get(`${resource}/admin/${uid}/users-progress`),
  getAdminContentProgress: (uid: string) => service({ requiresAuth: true }).get(`${resource}/admin/${uid}/content-progress`),
}
