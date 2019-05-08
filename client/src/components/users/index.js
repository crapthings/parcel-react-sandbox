@observer
export default class Users extends Component {
  render() {
    return (
      <div id='users'>
        <App.Axios name='users' url='users'>
          {({ result: { users } }, { refresh, refreshToken }) => {
            return (
              <div>
                <button onClick={refresh}>refresh {refreshToken}</button>
                {users.map(user => {
                  return (
                    <div key={user._id}>
                      <div>{user.username}</div>
                    </div>
                  )
                })}
              </div>
            )
          }}
        </App.Axios>
      </div>
    )
  }
}
