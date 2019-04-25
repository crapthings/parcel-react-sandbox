import Header from './header'
import Aside from './aside'
import Main from './main'
import Login from '../login'

@observer
class Layout extends Component {
  render() {
    return (
      <div id='layout'>
        <Aside />
        <Main>
          <Header />
          {this.props.children}
        </Main>
        <Login />
      </div>
    )
  }
}

export default Children => {
  return function Wrapper() {
    return (
      <Layout>
        <MUI.CssBaseline />
        <Children />
      </Layout>
    )
  }
}
