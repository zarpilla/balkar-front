import service from '@/service/index'

const resource: string = 'auth'
export const auth = {
  get: (): Promise<any> => service({ requiresAuth: true }).get(`users/me`),
  login: (login: string, password: string): Promise<any> =>
    service().post('auth/local', {
      identifier: login,
      password: password
    }),
    register: (username: string, email: string, password: string): Promise<any> =>
    service().post('auth/local/register', {
      username: username,
      email: email,
      password: password
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
    service({ requiresAuth: true }).post(`auth/send-email-confirmation`, { email })
}
