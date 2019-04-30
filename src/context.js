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

axios.interceptors.request.use(function (request) {
  request.headers.common.token = localStorage.getItem('token')
  return request
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  ui.err = 'xhr failed'
  return Promise.reject(error)
})

const login = async function (username, password) {
  const { data: { token, currentUser } } = await app.axios.post('/login', { username, password })
  // 用 autorun 处理这部分比较屌
  app.ctx.token = token
  app.ctx.currentUser = currentUser
  localStorage.setItem('token', token)
  localStorage.setItem('currentUser', JSON.stringify(currentUser))
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
