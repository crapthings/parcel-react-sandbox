@observer
export default class Aside extends Component {
  render() {
    return (
      <div id='aside'>
        <div>
          <Link to='/'>home</Link>
        </div>
        <div>
          <Link to='/list'>list</Link>
        </div>
      </div>
    )
  }
}
