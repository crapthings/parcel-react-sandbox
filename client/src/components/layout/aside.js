@observer
export default class Aside extends Component {
  render() {
    return (
      <div className='flex-column' id='aside'>
        <div>
          <Link to='/'>home</Link>
        </div>

        <div>
          <Link to='/files'>files</Link>
        </div>

        <div>
          <Link to='/lists'>lists</Link>
        </div>
      </div>
    )
  }
}
