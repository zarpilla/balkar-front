import service from '@/service/index'

const resource: string = 'auth'
export const auth = {
  get: (): Promise<any> => service({ requiresAuth: true }).get(`users/me?populate=interests`),
  login: (login: string, password: string): Promise<any> =>
    service().post('auth/local', {
      identifier: login,
      password: password
    }),
    register: (email: string, password: string, name: string, lastname: string): Promise<any> =>
    service().post('auth/local/register', {
      username: email,
      email: email,
      password: password,
      name: name,
      lastname: lastname
    }),
  resetPassword: (code: string, password: string, passwordConfirmation: string) =>
    service({ requiresAuth: true }).post(`auth/reset-password`, {
      code,
      password,
      passwordConfirmation
    }),

  forgot: (email: string) =>
    service().post('auth/forgot-password', {
      email: email
    }),
  changePassword: (currentPassword: string, password: string, passwordConfirmation: string) => 
    service({ requiresAuth: true }).post('auth/change-password', {
      currentPassword, password, passwordConfirmation
    }),
  
  emailConfirmation: (email: string) =>
    service({ requiresAuth: true }).post(`auth/send-email-confirmation`, { email }),
  update: (id: string, data: any) => 
    service({ requiresAuth: true }).put(`users/${id}`, data ),

}
