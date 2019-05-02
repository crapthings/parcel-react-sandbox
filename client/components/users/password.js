export default class ChangePassword extends Component {
  onSubmit = evt => {
    evt.preventDefault()
    const password = evt.target[0].value
    const newPassword = evt.target[1].value
    const confirmPassword = evt.target[2].value
    if (newPassword != confirmPassword)
      return app.ui.err = 'failed to confirm new password'
    app.password(password, newPassword)
  }

  render() {
    return (
      <div>
        <h3>Change Password</h3>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>
              Password
              <input type='password' />
            </label>
          </div>

          <div>
            <label>
              New Password
              <input type='password' />
            </label>
          </div>

          <div>
            <label>
              Confirm Password
              <input type='password' />
            </label>
          </div>

          <div>
            <input type='submit' />
          </div>
        </form>
      </div>
    )
  }
}
