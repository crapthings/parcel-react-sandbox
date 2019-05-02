import { toJS } from 'mobx'

app.register = async function (username, password) {
  app.ui.isLogging = true

  const { data: { err, result } } = await app.axios.post('/register', { username, password })

  if (err) {
    app.ui.isLogging = false
    return app.ui.err = err
  }

  const { token, currentUser } = result

  app.ui.isLogging = false
  app.ctx.token = token
  app.ctx.currentUser = currentUser
  app.route.replace('/')
}

app.login = async function (username, password) {
  app.ui.isLogging = true

  const { data: { err, result } } = await app.axios.post('/login', { username, password })

  if (err) {
    app.ui.isLogging = false
    return app.ui.err = err
  }

  const { token, currentUser } = result

  app.ui.isLogging = false
  app.ctx.token = token
  app.ctx.currentUser = currentUser
  app.route.replace('/')
}

app.loginWithToken = async function () {
  const token = localStorage.getItem('token')

  if (!token) {
    return app.ui.isLogging = false
  }

  app.ui.isLogging = true

  const { data: { err, result } } = await app.axios.post('/token', { token })

  if (err) {
    app.ui.isLogging = false
    return app.ui.err = err
  }

  const { currentUser } = result

  app.ui.isLogging = false
  app.ctx.token = token
  app.ctx.currentUser = currentUser
}

app.password = async function (password, newPassword) {
  app.ui.isLogging = true

  const { data: { err } } = await app.axios.post('/password', { password, newPassword })

  if (err) {
    app.ui.isLogging = false
    return app.ui.err = err
  }

  app.ui.isLogging = false
  app.ctx.token = null
  app.ctx.currentUser = {}
  app.route.replace('/')
}

app.logout = function () {
  app.ui.isLogging = false
  app.ctx.token = null
  app.ctx.currentUser = {}
  app.route.replace('/')
}

autorun(() => {
  const { token, currentUser: _currentUser } = app.ctx
  const currentUser = toJS(_currentUser)

  if (token && currentUser._id) {
    localStorage.setItem('token', token)
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  } else if (!token && !currentUser._id) {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
  }
}, {
  delay: 50,
})
