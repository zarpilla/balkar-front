import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'forums'
export const forums = {
  ...CreateBaseApiService(resource),
  get: (id: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}`),
  mine: () => service({ requiresAuth: true }).get(`${resource}/mine`)
}
