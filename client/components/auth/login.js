@observer
export default class Login extends Component {
  login = async evt => {
    evt.preventDefault()
    const username = evt.target[0].value
    const password = evt.target[1].value
    app.login(username, password)
  }

  render() {
    return (
      <div>
        <form onSubmit={this.login}>
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
            <input type='submit' />
          </div>
        </form>
        <div>{app.ui.err}</div>
      </div>
    )
  }
}
