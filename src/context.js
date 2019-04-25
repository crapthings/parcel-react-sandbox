import { createBrowserHistory } from 'history'

const route = createBrowserHistory({})

const ui = observable({
  header: 'this is header',
  aside: 'this is aside',
  main: 'this is main',
  text: 'this is text',
})

const app = {
  route,
  ui,
}

export default {
  app,
}
