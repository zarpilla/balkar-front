import service from '@/service/index'
import { CreateBaseApiService } from '@/service/api/createBaseApiService'

const resource: string = 'pre-enrollements'
export const preEnrollements = {
  ...CreateBaseApiService(resource)
}
