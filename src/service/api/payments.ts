import service from '@/service/index'
import { CreateBaseApiLocaleService } from '@/service/api/createBaseApiService'

const resource: string = 'payment-intents'
export const payment = {
  //...CreateBaseApiLocaleService(resource),
  createCheckoutSession: (uid: string, payload: any) => service({ requiresAuth: true }).post(`${resource}/create-checkout-session/${uid}`, payload),
  check: (id: string) => service({ requiresAuth: true }).post(`${resource}/check`, { id: id }),
}
