import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'bookmarks'
export const bookmarks = {
  // ...CreateBaseApiService(resource)
  create: (payload: any) => service({ requiresAuth: true }).post(`${resource}/create`, { data: payload }),
  delete: (payload: any) => service({ requiresAuth: true }).post(`${resource}/delete`, { data: payload }),
}
