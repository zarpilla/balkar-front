import axios from 'axios'

export default ({ requiresAuth = false, multipart = false } = {}) => {
  const options: any = {}
  options.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

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
