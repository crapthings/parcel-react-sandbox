import _axios from 'axios'

app.axios = _axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 5000,
})

app.axios.interceptors.request.use(function (request) {
  request.headers.common.token = localStorage.getItem('token')
  return request
}, function (error) {
  return Promise.reject(error)
})

app.axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  app.ui.err = 'xhr failed'
  return Promise.reject(error)
})

app.login = async function (username, password) {
  const { data: { token, currentUser } } = await app.axios.post('/login', { username, password })
  // 用 autorun 处理这部分比较屌
  app.ctx.token = token
  app.ctx.currentUser = currentUser
  localStorage.setItem('token', app.ctx.token)
  localStorage.setItem('currentUser', JSON.stringify(app.ctx.currentUser))
  app.route.push('/')
}

app.logout = function () {
  app.ctx.token = null
  app.ctx.currentUser = {}
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  app.route.push('/')
}

app.loginWithToken = async function () {
  const token = localStorage.getItem('token')
  if (!token) return
  const { data: { currentUser } } = await app.axios.post('/token', { token })
  app.ctx.currentUser = currentUser
  app.ctx.token = token
}
