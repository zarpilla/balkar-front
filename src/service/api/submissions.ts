import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'submissions'
export const submissions = {
  ...CreateBaseApiService(resource),
  review: (id: number | string, payload: { feedback?: string; grade?: string }) =>
    service({ requiresAuth: true }).put(`${resource}/${id}/review`, { data: payload }),
  // enroll: (payload: any) => service({ requiresAuth: true }).post(`${resource}/enroll`, { data: payload }),
}
