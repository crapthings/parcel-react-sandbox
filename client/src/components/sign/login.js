@observer
export default class Login extends Component {
  onSubmit = async evt => {
    evt.preventDefault()
    const username = evt.target[0].value
    const password = evt.target[1].value
    app.login(username, password)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>
               Username
              <input type='text' autoFocus />
            </label>
          </div>

          <div>
            <label>
              Password
              <input type='password' />
            </label>
          </div>

          <div>
            <input type='submit' value='Login' />
          </div>

          <div>
            <Link to='/register'>Register</Link>
          </div>
        </form>
        <div>{app.err}</div>
      </div>
    )
  }
}
