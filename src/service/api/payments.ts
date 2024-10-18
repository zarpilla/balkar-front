import service from '@/service/index'
import { CreateBaseApiLocaleService } from '@/service/api/createBaseApiService'

const resource: string = 'payment-intents'
export const payment = {
  //...CreateBaseApiLocaleService(resource),
  createCheckoutSession: (uid: string, email: string) => service({ requiresAuth: true }).post(`${resource}/create-checkout-session/${uid}`, {email: email}),
  check: (id: string) => service({ requiresAuth: true }).post(`${resource}/check`, { id: id }),
}
