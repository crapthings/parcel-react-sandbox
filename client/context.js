const ctx = observable({
  currentUser: {},
  token: null,
})

const ui = observable({
  err: null,
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
