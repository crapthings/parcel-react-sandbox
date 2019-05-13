import { createBrowserHistory } from 'history'

import { render } from 'react-dom'

import {
  Router,
  Route,
  Switch,
} from 'react-router-dom'

import { AxiosProvider } from 'react-axios'

import {
  NotFound,
  Err,
  Auth,
  Layout,
  Register,
  Login,
  My,
  Home,
  About,
  Users,
  Files,
  Lists,
} from './'

app.route = createBrowserHistory({})

app.route.listen(function () {
  app.location.search = app.route.location.search
  app.location.hash = app.route.location.hash
  console.log(app.location)
})

app.location = observable({
  search: app.route.location.search,
  hash: app.route.location.hash,
})

class Root extends Component {
  state = {
    error: undefined
  }

  static getDerivedStateFromError(error) {
    return { error: true }
  }

  componentDidCatch(error, info) {
    const { userAgent } = navigator

    app.axios.post('/logs', {
      userAgent,
      location,
      app,
      error,
      info,
    })
  }

  render() {
    const { error } = this.state

    return error ? <Err /> : (
      <AxiosProvider instance={app.axios}>
        <Router history={app.route}>
          <Switch>
            <Route path='/' component={Home |> Layout |> Auth} exact />
            <Route path='/index.html' component={Home |> Layout |> Auth} />
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/my' component={My |> Layout |> Auth} />
            <Route path='/users' component={Users |> Layout |> Auth} />
            <Route path='/files' component={Files |> Layout |> Auth} />
            <Route path='/lists' component={Lists |> Layout |> Auth} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </AxiosProvider>
    )
  }
}

render(<Root />, document.getElementById('root'))
