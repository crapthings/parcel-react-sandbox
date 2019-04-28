import Aside from './aside'
import Content from './content'

@observer
export default class Main extends Component {
  render() {
    return (
      <div className='flex' id='main'>
        <Aside />
        <Content>
          {this.props.children}
        </Content>
      </div>
    )
  }
}
