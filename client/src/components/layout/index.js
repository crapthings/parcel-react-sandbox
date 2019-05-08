import Header from './header'
import Main from './main'

@observer
class Layout extends Component {
  render() {
    return (
      <div id='layout'>
        <Header />
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
