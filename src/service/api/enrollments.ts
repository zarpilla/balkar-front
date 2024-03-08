import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'enrollments'
export const enrollments = {
  // ...CreateBaseApiService(resource)
  enroll: (payload: any) => service({ requiresAuth: true }).post(`${resource}/enroll`, { data: payload }),
  autoenroll: () => service({ requiresAuth: true }).post(`${resource}/autoenroll`, {}),
}
