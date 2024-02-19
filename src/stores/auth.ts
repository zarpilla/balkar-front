import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /* User */
    userId: '' as string,
    userName: '' as string,
    userEmail: '' as string,
    pictureUrl: '' as string,
    jwt: '' as string,
    hasGSToken: '0' as string,
    notificationToken: '' as string
  }),
  actions: {
    setUser(payload: any) {
      if (payload.id) {
        this.userId = payload.id
        localStorage.setItem('user.id', payload.id)
      }
      if (payload.name) {
        this.userName = payload.name
        localStorage.setItem('user.name', payload.name)
      }
      if (payload.email) {
        this.userEmail = payload.email
        localStorage.setItem('user.email', payload.email)
      }
      if (payload.jwt) {
        this.jwt = payload.jwt
        localStorage.setItem('user.jwt', payload.jwt)
      }
      if (payload.pictureUrl) {
        this.pictureUrl = payload.pictureUrl
        localStorage.setItem('user.pictureUrl', payload.pictureUrl)
      }
      if (payload.hasGSToken) {
        this.hasGSToken = payload.hasGSToken
        localStorage.setItem('user.hasGSToken', payload.hasGSToken ? '1' : '0')
      }
    },

    isAuthenticated() {
      return localStorage.getItem('user.id')
    },

    hasGSRegistered() {
      return localStorage.getItem('user.hasGSToken') === '1'
    },

    removeGSRegisteredStatus() {
      this.hasGSToken = '0'
      localStorage.removeItem('user.hasGSToken')
      localStorage.removeItem('user.monetrToken')
    },

    setGSRegistered(valueGSToken: string, valueGSState: string) {
      this.hasGSToken = valueGSToken
      localStorage.removeItem('user.hasGSToken')
      localStorage.removeItem('user.monetrToken')
      localStorage.setItem('user.monetrToken', valueGSState)
      localStorage.setItem('user.hasGSToken', valueGSToken)
    },

    setNotificationToken(token: string) {
      this.notificationToken = token
    },

    logout() {
      localStorage.removeItem('user.id')
      localStorage.removeItem('user.name')
      localStorage.removeItem('user.email')
      localStorage.removeItem('user.jwt')
      localStorage.removeItem('user.pictureUrl')
      localStorage.removeItem('user.hasGSToken')
      localStorage.removeItem('user.monetrToken')
    }
  }
})
