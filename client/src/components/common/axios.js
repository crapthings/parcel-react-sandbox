import { Request, Get, Post } from 'react-axios'

class Axios extends Component {
  state = {
    refreshToken: Date.now()
  }

  componentWillMount() {
    const { name } = this.props
    if (!name) return
    app.refresh[name] = this.refresh
  }

  componentWillUnmount() {
    const { name } = this.props
    if (!name) return
    delete app.refresh[name]
  }

  refresh = () => {
    this.setState({ refreshToken: Date.now() })
  }

  render() {
    const { props } = this
    const { refreshToken } = this.state
    const { name } = props
    return (
      <Request {...props} refreshToken={refreshToken}>
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
            const { data } = response
            if (_.isEmpty(data)) {
              return <div>empty state</div>
            } else {
              return props.children(data, {
                refresh: this.refresh,
                refreshToken,
              })
            }
          } else {
            return (
              <div>loading</div>
            )
          }
        }}
      </Request>
    )
  }
}

App.Fetch = App.Axios = Axios
App.Request = Request
App.Get = Get
App.Post = Post
