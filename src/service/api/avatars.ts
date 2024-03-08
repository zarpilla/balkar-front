import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'user-avatars'
export const avatars = {
  ...CreateBaseApiService(resource),
  mine: () => service({ requiresAuth: true }).get(`${resource}/mine`),
}
