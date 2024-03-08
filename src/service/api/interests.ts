import service from '@/service/index'
import { CreateBaseApiLocaleService } from '@/service/api/createBaseApiService'

const resource: string = 'interests'
export const interests = {
  ...CreateBaseApiLocaleService(resource)  
}
