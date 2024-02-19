import service from '@/service/index'
import CreateBaseApiService from '@/service/api/createBaseApiService'

const resource: string = 'translations'
export const translations = {
  ...CreateBaseApiService(resource)
}
