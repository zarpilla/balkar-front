import service from '@/service/index'

const resource: string = 'channels'
export const channels = {
  // ...CreateBaseApiService(resource)
  messages: (id: string, limit: number, start: number) => service({ requiresAuth: true }).get(`${resource}/messages/${id}?_limit=${limit}&_start=${start}`),
  createPrivate: (uid: string, userId: number) => service({ requiresAuth: true }).post(`${resource}/private`, { uid, userId }),
}
