import { render } from 'react-dom'

import {
  Router,
  Route,
  Switch,
} from 'react-router-dom'

import {
  Layout,
  Home,
  About,
} from './components'

class Root extends Component {
  render() {
    return (
      <Router history={app.route}>
        <Switch>
          <Route path='/' component={Layout(Home)} exact />
          <Route path='/about' component={Layout(About)} />
        </Switch>
      </Router>
    )
  }
}

render(<Root />, document.getElementById('root'))
