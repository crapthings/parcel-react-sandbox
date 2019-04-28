import Login from './login'

@observer
class Auth extends Component {
  render() {
    return(
      <Axios.Post url='token'>
        {(error, response, isLoading, makeRequest, axios) => {
          if (isLoading) {
            return (
              <div>loading</div>
            )
          } else if (error) {
            return (
              <div>{error}</div>
            )
          } else if (response) {
            if (app.ctx.currentUser.username) {
              return this.props.children
            } else {
              return <Login />
            }
          } else {
            return (
              <div>loading</div>
            )
          }
        }}
      </Axios.Post>
    )
  }
}

export default Children => () => {
  return (
    <Auth>
      <Children />
    </Auth>
  )
}
