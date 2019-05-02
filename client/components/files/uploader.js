export default class Uploader extends Component {
  state = {
    progress: null,
  }

  onSubmit = async evt => {
    evt.preventDefault()

    const { files } = evt.target[0]

    if (_.isEmpty(files)) {
      return app.ui.err = 'no files were found'
    }

    const data = new FormData()

    _.each(files, file => data.append('file', file))

    const { err, result } = await app.axios.post('/upload', data, {
      onUploadProgress: progressEvent => {
        this.setState({
          progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
        })
      }
    })

    if (err) {
      return app.ui.err = err
    }
  }

  render() {
    return (
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
    )
  }
}
