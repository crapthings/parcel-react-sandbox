import Uploader from './uploader'

@observer
export default class List extends Component {
  render() {
    return (
      <div>
        <Uploader />
        <App.Axios name='files' url='files'>
          {({ result: { files } }, { refresh, refreshToken }) => {
            return (
              <div>
                <button onClick={refresh}>refresh {refreshToken}</button>
                <table>
                  <thead>
                    <tr>
                      <th>filename</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map(item => {
                      return (
                        <tr key={item._id}>
                          <td>{item.originalname}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }}
        </App.Axios>
      </div>
    )
  }
}
