import axios from 'axios'
import { getApiBase } from '@/utils/config'

export default ({ requiresAuth = false, multipart = false } = {}) => {
  const options: any = {}
  const apiBase = getApiBase()
  options.baseURL = apiBase + '/api'

  if (requiresAuth) {
    const jwt = localStorage.getItem('user.jwt')
    if (jwt) {
      // const user = JSON.parse(userFromStorage)
      options.headers = { Authorization: `Bearer ${jwt}` }
    }
  }
  if (multipart) {
    options.headers = options.headers || {}
    options.headers['Content-Type'] = 'multipart/form-data'
  }
  const instance = axios.create(options)

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error && error.response && error.response.data && error.response.data.error) {        
        return Promise.reject(error.response.data.error)
      }
      else {
        return Promise.reject(error)
      }
      
    }
  )
  return instance
}
