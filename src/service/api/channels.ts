import service from '@/service/index'
import CreateBaseApiService from '@/service/api/createBaseApiService'

const resource: string = 'channels'
export const channels = {
  // ...CreateBaseApiService(resource)
  messages: (id: string, limit: number, start: number) => service({ requiresAuth: true }).get(`${resource}/messages/${id}?_limit=${limit}&_start=${start}`),
}
