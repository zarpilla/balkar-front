import service from '@/service/index'
import CreateBaseApiService from '@/service/api/createBaseApiService'

const resource: string = 'messages'
export const messages = {
  ...CreateBaseApiService(resource),
  getChildren: (id: string) => service({ requiresAuth: true }).get(`${resource}/children/${id}`),
}
