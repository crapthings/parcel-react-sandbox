import { createBrowserHistory } from 'history'

import { render } from 'react-dom'

import {
  Router,
  Route,
  Switch,
} from 'react-router-dom'

import { AxiosProvider } from 'react-axios'

import {
  Err,
  Auth,
  Login,
  Layout,
  Home,
  About,
  List,
} from './'

app.route = createBrowserHistory({})

app.route.listen(function () {})

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
            <Route path='/' component={Auth(Layout(Home))} exact />
            <Route path='/login' component={Login} />
            <Route path='/secret1' component={Auth(Layout(About))} />
            <Route path='/list' component={Auth(Layout(List))} />
          </Switch>
        </Router>
      </AxiosProvider>
    )
  }
}

render(<Root />, document.getElementById('root'))
