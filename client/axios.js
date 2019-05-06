import _axios from 'axios'

app.axios = _axios.create({
  baseURL: '/api',
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
  return Promise.reject(error)
})
