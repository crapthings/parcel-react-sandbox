import { Request, Get, Post } from 'react-axios'

export default class Axios extends Component {
  render() {
    const { props } = this
    return (
      <Request {...props}>
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
              return props.children(data)
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
