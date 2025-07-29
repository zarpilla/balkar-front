import service from '@/service/index'
import { CreateBaseApiLocaleService } from '@/service/api/createBaseApiService'

const resource: string = 'translations'
export const translations = {
  ...CreateBaseApiLocaleService(resource)
}
