import Login from '../sign/login'

@observer
class Auth extends Component {
  render() {
    if (app.ui.isLogging) {
      return (
        <div>loading</div>
      )
    } else if (app.ctx.currentUser._id) {
      return (
        <div>
          {this.props.children}
        </div>
      )
    } else {
      return <Login />
    }
  }
}

export default Children => () => {
  return (
    <Auth>
      <Children />
    </Auth>
  )
}
