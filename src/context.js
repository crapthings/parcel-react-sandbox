import axios from 'axios'
import { createBrowserHistory } from 'history'

const route = createBrowserHistory({})

const ui = observable({
  header: 'this is header',
  aside: 'this is aside',
  main: 'this is main',
  text: 'this is text',
  currentPage: 'Home',
  modal: {
    login: false,
    aside: true,
  }
})

const token = localStorage.getItem('token')

const _axios = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 3000,
  headers: { token: token }
})

const app = {
  route,
  ui,
  _axios,
}

route.listen(function () {})

export default {
  app,
}
