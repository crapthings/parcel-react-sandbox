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
            <div>logo</div>
            <div className='flex flex-1'></div>
            <div>
              <div>
                <Link to='/profile'>{currentUser.username}</Link>
              </div>
              <div>
                <a href="/logout" onClick={this.logout}>logout</a>
              </div>
            </div>
          </>
        ) : <Link to='/login'>login</Link>}
      </div>
    )
  }
}
