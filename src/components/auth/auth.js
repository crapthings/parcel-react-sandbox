class Auth extends Component {
  render() {
    return(
      <AxiosPost url='token'>
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
            return this.props.children
          } else {
            return (
              <div>loading</div>
            )
          }
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
