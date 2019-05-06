@observer
export default class Header extends Component {
  logout = evt => {
    evt.preventDefault()
    app.logout()
  }

  render() {
    const { currentUser } = app.ctx
    return (
      <div className='flex' id='header'>
        {currentUser.username ? (
          <>
            <div>
              <Link to='/'>logo</Link>
            </div>
            <div className='flex flex-1'></div>
            <div className='flex'>
              <div>
                <Link to='/my'>{currentUser.username}</Link>
              </div>
              <div>
                <a href="/logout" onClick={this.logout}>logout</a>
              </div>
            </div>
          </>
        ) : <div className='flex'>
          <div>
            <div>
              <Link to='/login'>login</Link>
            </div>

            <div>
              <Link to='/register'>register</Link>
            </div>
          </div>
        </div>}
      </div>
    )
  }
}
