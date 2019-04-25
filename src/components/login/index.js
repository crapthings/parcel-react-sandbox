@observer
export default class Login extends Component {
  closeLoginModal = () => {
    app.ui.modal.login = false
  }

  render() {
    return (
      <MUI.Dialog open={app.ui.modal.login} onClose={this.closeLoginModal}>
        <MUI.DialogTitle id='form-dialog-title'>
          Login
        </MUI.DialogTitle>
        <MUI.DialogContent>
          <MUI.DialogContentText>
            Please Login to Continue...
          </MUI.DialogContentText>
          <MUI.TextField
            autoFocus
            margin='dense'
            label='Email'
            type='email'
            fullWidth
          />
          <MUI.TextField
            margin='dense'
            label='Password'
            type='password'
            fullWidth
          />
        </MUI.DialogContent>
        <MUI.DialogActions>
          <MUI.Button onClick={this.closeLoginModal} color='primary'>
            Cancel
          </MUI.Button>
          <MUI.Button color='primary'>
            Login
          </MUI.Button>
        </MUI.DialogActions>
      </MUI.Dialog>
    )
  }
}
