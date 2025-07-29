import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'forums'
export const forums = {
  ...CreateBaseApiService(resource),
  get: (id: string, locale: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}`, { params: { locale } }),
  mine: () => service({ requiresAuth: true }).get(`${resource}/mine`),
  unreadCounts: (forumId: string) => service({ requiresAuth: true }).get(`${resource}/unread-counts`, { params: { forumId } }),
  markChannelAsRead: (channelId: string) => service({ requiresAuth: true }).post(`${resource}/mark-as-read`, { channelId }),
  markChannelAsReadAll: (channelId: string) => service({ requiresAuth: true }).post(`${resource}/mark-channel-as-read-all`, { channelId })
}
