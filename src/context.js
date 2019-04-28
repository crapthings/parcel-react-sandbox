import { createBrowserHistory } from 'history'
import _axios from 'axios'

const ctx = observable({
  currentUser: {},
})

const ui = observable({
  err: null,
})

const route = createBrowserHistory({})

const axios = _axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 3000,
})

axios.interceptors.request.use(function (config) {
  config.headers.common.token = localStorage.getItem('token')
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  if (/\/api\/token/.test(response.request.responseURL)) {
    const { data: { currentUser } } = response
    if (currentUser) {
      app.ctx.currentUser = currentUser
    }
  }
  return response
}, function (error) {
  ui.err = 'xhr failed'
  return Promise.reject(error)
})

const login = async function (username, password) {
  const { data: { token, currentUser } } = await app.axios.post('/login', { username, password })
  localStorage.setItem('token', token)
  app.ctx.currentUser = currentUser
  route.push('/')
}

const logout = function () {
  localStorage.removeItem('token')
  app.ctx.currentUser = {}
  route.push('/')
}

const refresh = {}

const app = {
  ctx,
  ui,
  route,
  axios,
  login,
  logout,
  refresh,
}

route.listen(function () {})

export default {
  app,
}
