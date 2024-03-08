import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'progresses'
export const progresses = {
  // ...CreateBaseApiService(resource)
  complete: (payload: any) => service({ requiresAuth: true }).post(`${resource}/complete`, { data: payload }),
  notcomplete: (payload: any) => service({ requiresAuth: true }).post(`${resource}/notcomplete`, { data: payload }),
}
