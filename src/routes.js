
import { render } from 'react-dom'

import {
  Router,
  Route,
  Switch,
} from 'react-router-dom'

import { AxiosProvider } from 'react-axios'

import {
  Auth,
  Layout,
  Home,
  About,
} from './components'

class Root extends Component {
  render() {
    return (
      <AxiosProvider instance={app._axios}>
        <Router history={app.route}>
          <Switch>
            <Route path='/' component={Layout(Home)} exact />
            <Route path='/about' component={Auth(Layout(About))} />
          </Switch>
        </Router>
      </AxiosProvider>
    )
  }
}

render(<Root />, document.getElementById('root'))
