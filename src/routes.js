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
} from './components'

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
          </Switch>
        </Router>
      </AxiosProvider>
    )
  }
}

render(<Root />, document.getElementById('root'))
