@observer
@Axios(async () => await app.axios.get('/files'))
class List extends Component {
  state = {
    progress: null,
  }

  onSubmit = async evt => {
    evt.preventDefault()

    const { files } = evt.target[0]

    if (_.isEmpty(files)) {
      return app.err = 'no files were found'
    }

    const data = new FormData()

    _.each(files, file => data.append('file', file))

    const { data: { err, result } } = await app.axios.post('/files', data, {
      onUploadProgress: progressEvent => {
        this.setState({
          progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
        })
      }
    })

    if (err) {
      return app.err = err
    }

    console.log(result)
    this.result.files.push(...result.files)
  }

  remove = ({ _id, itemIdx }) => async evt => {
    const data = { _id }
    await app.axios.delete('/files', { data })
    this.result.files.splice(itemIdx, 1)
  }

  render() {
    return (
      <div>
        <div>
          {this.state.progress && this.state.progress}
          <form onSubmit={this.onSubmit}>
            <div>
              <label>
                Pick Files
                <input type='file' multiple hidden />
              </label>
            </div>

            <div>
              <input type='submit' value='upload' />
            </div>
          </form>
        </div>

        <div>
          <table>
            <thead>
              <tr>
                <th>filename</th>
                <th>op</th>
              </tr>
            </thead>
            <tbody>
              {this.result.files.map((item, itemIdx) => {
                return (
                  <tr key={item._id}>
                    <td>{item.originalname}</td>
                    <td>
                      <button onClick={this.remove({ _id: item._id, itemIdx })}>remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default List