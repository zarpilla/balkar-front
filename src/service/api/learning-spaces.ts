import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'learning-spaces'
export const learningSpaces = {
  ...CreateBaseApiService(resource),
  get: (id: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}`),
  mine: () => service({ requiresAuth: true }).get(`${resource}/mine`),
}
