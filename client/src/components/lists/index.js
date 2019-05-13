@observer
export default class List extends Component {
  render() {
    const params = new URLSearchParams(app.location.search)
    const page = params.get('page')
    return (
      <div id='lists'>
        <App.Axios name='lists' url='lists' params={{ page }}>
          {({ page, result: { lists } }, { refresh, refreshToken }) => {

            return (
              <>
                <button onClick={refresh}>refresh {refreshToken}</button>
                <table>
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>createdAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lists.map(item => {
                      return (
                        <tr key={item._id}>
                          <td>
                            <Link to={`/lists/${item._id}`}>{item.name}</Link>
                          </td>

                          <td>{item.createdAt}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div>
                  {_.map(_.range(page.size / page.limit), n => <div>
                    <Link to={`/lists?page=${n + 1}`}>{n + 1}</Link>
                  </div>)}
                </div>
              </>
            )
          }}
        </App.Axios>
      </div>
    )
  }
}
