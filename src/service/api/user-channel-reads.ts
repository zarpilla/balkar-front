import service from '@/service/index'

const resource: string = 'user-channel-reads'
export const userChannelReads = {
  // ...CreateBaseApiService(resource)
  getChannelReadStatus: (channelId: string) => service({ requiresAuth: true }).get(`${resource}/channel/${channelId}`),
  getUserReadStatuses: () => service({ requiresAuth: true }).get(`${resource}/user-statuses`),
  // Additional methods can be added here as needed
}
