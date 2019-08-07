import { createBrowserHistory } from 'history'
import axios from 'axios'

export const app = new class {
  route = createBrowserHistory({})

  axios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    timeout: 5000,
  })

  @observable err = null
  @observable isLogging = true
  @observable currentUser = null

  @action
  async register(username, password) {
    this.isLogging = true

    const { data: { err, result } } = await this.axios.post('/register', { username, password })

    if (err) {
      this.isLogging = false
      return this.err = err
    }

    const { token, currentUser } = result

    localStorage.setItem('token', token)
    this.currentUser = currentUser
    this.isLogging = false
    this.route.replace('/')
  }

  @action
  async loginWithToken() {
    const token = localStorage.getItem('token')

    if (!token) {
      return this.isLogging = false
    }

    this.isLogging = true

    const { data: { err, result } } = await this.axios.post('/token', { token })

    if (err) {
      this.isLogging = false
      return this.err = err
    }

    const { currentUser } = result

    localStorage.setItem('token', token)
    this.currentUser = currentUser
    this.isLogging = false
  }

  @action
  async login(username, password) {
    this.isLogging = true

    const { data: { err, result } } = await this.axios.post('/login', { username, password })

    if (err) {
      this.isLogging = false
      return this.err = err
    }

    const { token, currentUser } = result

    localStorage.setItem('token', token)
    this.currentUser = currentUser
    this.isLogging = false
    this.route.replace('/')
  }

  @action
  logout() {
    localStorage.removeItem('token')
    this.currentUser = null
    this.isLogging = false
    this.route.replace('/')
  }

  async changePassword(password, newPassword) {
    const { data: { err } } = await this.axios.post('/password', { password, newPassword })
    if (err) {
      this.err = err
    }
  }
}

app.axios.interceptors.request.use(function (request) {
  request.headers.common.token = localStorage.getItem('token')
  return request
}, function (error) {
  return Promise.reject(error)
})

app.axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})
