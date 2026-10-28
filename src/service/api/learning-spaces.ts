import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'learning-spaces'
export const learningSpaces = {
  ...CreateBaseApiService(resource),
  get: (id: string, locale: string) => service({ requiresAuth: true }).get(`${resource}/uid/${id}?locale=${locale}`),
  mine: (locale: string) => service({ requiresAuth: true }).get(`${resource}/mine?locale=${locale}`),
  getAdminUsersProgress: (uid: string, locale: string) =>
    service({ requiresAuth: true }).get(`${resource}/admin/${uid}/users-progress?locale=${locale}`),
  getAdminContentProgress: (uid: string, locale: string) =>
    service({ requiresAuth: true }).get(`${resource}/admin/${uid}/content-progress?locale=${locale}`),
  getAdminQuizAttempts: (uid: string, locale: string) =>
    service({ requiresAuth: true }).get(`${resource}/admin/${uid}/quiz-attempts?locale=${locale}`),
  getAdminSubmissions: (uid: string, locale: string) =>
    service({ requiresAuth: true }).get(`${resource}/admin/${uid}/submissions?locale=${locale}`),
  getAdminAnnouncements: (uid: string, locale: string) =>
    service({ requiresAuth: true }).get(`${resource}/admin/${uid}/announcements?locale=${locale}`),
  createAdminAnnouncement: (uid: string, payload: { subject: string; text: string }) =>
    service({ requiresAuth: true }).post(`${resource}/admin/${uid}/announcements`, { data: payload }),
  cancelAdminAnnouncement: (uid: string, id: number | string) =>
    service({ requiresAuth: true }).delete(`${resource}/admin/${uid}/announcements/${id}`),
}
