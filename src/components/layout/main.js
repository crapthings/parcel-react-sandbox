@observer
export default class Main extends Component {
  render() {
    return (
      <main id='main'>
        {this.props.children}
      </main>
    )
  }
}
