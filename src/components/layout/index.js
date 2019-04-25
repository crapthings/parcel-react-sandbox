import Header from './header'
import Aside from './aside'
import Main from './main'

@observer
class Layout extends Component {
  render() {
    return (
      <div id='layout'>
        <Header />
        <Aside />
        <Main>
          {this.props.children}
        </Main>
      </div>
    )
  }
}

export default Children => {
  return function Wrapper() {
    return (
      <Layout>
        <Children />
      </Layout>
    )
  }
}
