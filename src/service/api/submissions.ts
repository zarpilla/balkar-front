import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'submissions'
export const submissions = {
  ...CreateBaseApiService(resource)
  // enroll: (payload: any) => service({ requiresAuth: true }).post(`${resource}/enroll`, { data: payload }),
}
