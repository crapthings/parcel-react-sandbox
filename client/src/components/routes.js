import { render } from 'react-dom'

import {
  Router,
  Route,
  Switch,
} from 'react-router-dom'

import {
  NotFound,
  Err,
  Auth,
  Layout,
  Register,
  Login,
  My,
  Home,
  Files,
  Users,
  Dashboard,
  Settings,
  Statistics,
  Collection,
  Grid,
  Pivot,
  GridView,
  PivotView,
  SettingsViews,
  SettingsBoards,
  Board,
} from './'

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
      <Router history={app.route}>
        <Switch>
          <Route path='/' component={Home |> Layout |> Auth} exact />
          <Route path='/index.html' component={Home |> Layout |> Auth} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/my' component={My |> Layout |> Auth} />
          <Route path='/files' component={Files |> Layout |> Auth} />
          <Route path='/users' component={Users |> Layout |> Auth} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/settings' component={Settings} exact />
          <Route path='/settings/views' component={SettingsViews} exact />
          <Route path='/settings/boards' component={SettingsBoards} exact />
          <Route path='/statistics' component={Statistics} exact />
          <Route path='/statistics/:collection' component={Collection} />
          <Route path='/collections/:collection/grid' component={Grid} />
          <Route path='/collections/:collection/pivot' component={Pivot} />
          <Route path='/views/:view/table' component={GridView} />
          <Route path='/views/:view/pivot' component={PivotView} />
          <Route path='/boards/:board' component={Board} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))
