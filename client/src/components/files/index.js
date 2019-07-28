import Uploader from './uploader'

@observer
export default class List extends Component {
  render() {
    return (
      <div>
        <Uploader />
        <Axios name='files' url='files'>
          {({ result: { files } }) => {
            return (
              <div>
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
        </Axios>
      </div>
    )
  }
}
