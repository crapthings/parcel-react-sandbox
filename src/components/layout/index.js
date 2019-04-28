import Header from './header'
import Aside from './aside'
import Content from './content'

@observer
class Layout extends Component {
  render() {
    return (
      <div id='layout'>
        <Header />
        <div id='main'>
          <Aside />
          <Content>
            {this.props.children}
          </Content>
        </div>
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
