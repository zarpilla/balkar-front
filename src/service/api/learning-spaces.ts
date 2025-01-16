import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'learning-spaces'
export const learningSpaces = {
  ...CreateBaseApiService(resource),
  get: (id: string, locale: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}?locale=${locale}`),
  mine: (locale: string) => service({ requiresAuth: true }).get(`${resource}/mine?locale=${locale}`),
}
