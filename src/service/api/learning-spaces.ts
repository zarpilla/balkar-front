import service from '@/service/index'
import CreateBaseApiService from '@/service/api/createBaseApiService'

const resource: string = 'learning-spaces'
export const learningSpaces = {
  ...CreateBaseApiService(resource),
  mine: () => service({ requiresAuth: true }).get(`${resource}/mine`),
}
