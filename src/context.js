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

const app = {
  route,
  ui,
}

route.listen(function () {})

export default {
  app,
}
