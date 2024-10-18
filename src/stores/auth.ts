import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /* User */
    userId: '' as string,
    userName: '' as string,
    name: '' as string,
    lastname: '' as string,
    userEmail: '' as string,
    pictureUrl: '' as string,
    jwt: '' as string,
  }),
  actions: {
    setUser(payload: any) {
      if (payload.id) {
        this.userId = payload.id
        localStorage.setItem('user.id', payload.id)
      }
      if (payload.username) {
        this.userName = payload.username
        localStorage.setItem('user.username', payload.name)
      }
      if (payload.name) {
        this.name = payload.name
        localStorage.setItem('user.name', payload.name)
      }
      if (payload.lastname) {
        this.lastname = payload.lastname
        localStorage.setItem('user.lastname', payload.lastname)
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
    },

    isAuthenticated() {
      return localStorage.getItem('user.id')
    },


    logout() {
      this.userId = ''
      this.userName = ''
      this.name = ''
      this.lastname = ''
      this.userEmail = ''
      this.jwt = ''
      this.pictureUrl = ''
      localStorage.removeItem('user.id')
      localStorage.removeItem('user.name')
      localStorage.removeItem('user.lastname')
      localStorage.removeItem('user.username')
      localStorage.removeItem('user.email')
      localStorage.removeItem('user.jwt')
      localStorage.removeItem('user.pictureUrl')      
      sessionStorage.removeItem('autoenroll')
    }
  }
})
