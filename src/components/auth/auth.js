class Auth extends Component {
  render() {
    return(
      <AxiosPost url='login'>
        {(error, response, isLoading, makeRequest, axios) => {
          console.log(error, response, isLoading)

          if (isLoading) {
            return (
              <div>waiting for login</div>
            )
          }

          if (error) {
            return (
              <div>{response.data.err}</div>
            )
          }

          return (
            <div>
              {this.props.children}
            </div>
          )
        }}
      </AxiosPost>
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
