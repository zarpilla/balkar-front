import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'certificates'
export const certificates = {
  //...CreateBaseApiService(resource)
  issue: (uid: string) => service({ requiresAuth: true }).post(`${resource}/issue/${uid}`),
  // Public: no login needed
  verify: (code: string, locale: string) =>
    service().get(`${resource}/verify/${encodeURIComponent(code)}?locale=${encodeURIComponent(locale)}`),
}
