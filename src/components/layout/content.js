@observer
export default class Main extends Component {
  render() {
    return (
      <div id='content'>
        {this.props.children}
      </div>
    )
  }
}
