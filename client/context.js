const ctx = observable({
  token: null,
  currentUser: {},
})

const ui = observable({
  err: null,
  isLogging: true,
  loading: false,
})

const refresh = {}

export const app = {
  ctx,
  ui,
  refresh,
}

export const App = {

}

export default {
  app,
}
