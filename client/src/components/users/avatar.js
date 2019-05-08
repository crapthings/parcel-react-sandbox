export default class ChangePassword extends Component {
  state = {
    progress: null,
  }

  onSubmit = async evt => {
    evt.preventDefault()

    const { files } = evt.target

    if (_.isEmpty(files)) {
      return app.ui.err = 'no files were found'
    }

    const data = new FormData()

    _.each(files, file => data.append('file', file))

    const { data: { err, result } } = await app.axios.post('/avatar', data, {
      onUploadProgress: progressEvent => {
        this.setState({
          progress: Math.round((progressEvent.loaded * 100) / progressEvent.total)
        })
      }
    })

    if (err) {
      return app.ui.err = err
    }

    const { currentUser } = result

    app.ctx.currentUser = currentUser
  }

  render() {
    const { avatar } = app.ctx.currentUser
    return (
      <div>
        <h3>Avatar</h3>
        <form onSubmit={this.onSubmit}>
          <div>
            {avatar && <img className='avatar' src={`/private/${avatar}`} alt=""/>}
            <label>
              avatar
              <input type='file' onChange={this.onSubmit} hidden />
            </label>
          </div>
        </form>
      </div>
    )
  }
}
