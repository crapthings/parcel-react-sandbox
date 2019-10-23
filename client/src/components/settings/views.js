import TextareaAutosize from 'react-textarea-autosize'

class ViewForm extends Component {
  onSubmit = async evt => {
    evt.preventDefault()
    if (this.props.view) {
      await app.axios.put('/settings/views', { _id: this.props.view._id, script: this.refs.doc._ref.value })
    } else {
      await app.axios.post('/settings/views', { script: this.refs.doc._ref.value })
    }
    this.props.getViewsData()
  }

  onRemove = _id => async evt => {
    if (!confirm('确定要删除吗')) return
    await app.axios.delete('/settings/views', { data: { _id } })
    this.props.getViewsData()
  }

  render() {
    const { view } = this.props
    return (
      <>
        {view && <div className='mgt-md mgb'>
          <span className='mgr' id={view._id} style={{ fontSize: '1.4em', color: 'green' }}>{view.name}</span>
          <Link className='mgr' to={`/views/${view._id}/pivot`} target='blank'>Pivot view</Link>
          <a href={process.env.ROOT_URL ? `${process.env.ROOT_URL}/api/v1/views/${view._id}` : `http://localhost:3000/api/v1/views/${view._id}`} target='blank'>JSON view</a>
        </div>}
        <form onSubmit={this.onSubmit}>
          <TextareaAutosize style={{ width: '100%' }} ref='doc' autoComplete='off' autoCorrect='off' autoCapitalize='off' spellCheck='false' defaultValue={view && view.script} />
          <input type='submit' value='提交' />
          {view && <button onClick={this.onRemove(view._id)}>删除</button>}
        </form>
      </>
    )
  }
}

class GetViewsData extends Component {
  state = {
    loading: true,
    viewsData: undefined,
  }

  componentDidMount() {
    this.getViewsData()
  }

  getViewsData = async () => {
    let { data: viewsData } = await app.axios.get('/settings/views')
    viewsData.map(view => {
      view.name = _.first(view.script.split(/\n/))
      return view
    })
    this.setState({ loading: false, viewsData })
  }

  render() {
    const { loading, viewsData } = this.state
    const { getViewsData } = this

    if (loading) return <div>读取中。。。</div>

    return this.props.children({ viewsData, getViewsData })
  }
}

export default class extends Component {
  render() {
    return (
      <GetViewsData>
        {({ viewsData, getViewsData }) => (
          <div className='flex-row'>
            <div className='pd' style={{ width: '120px' }}>
              <div style={{ position: 'fixed' }}>
                {viewsData.map(view => <div>
                  <a href={`#${view._id}`} style={{ fontSize: '.9em', color: 'green' }}>{view.name}</a>
                </div>)}
              </div>
            </div>
            <div className='flex-column flex-1x pd-md' style={{ position: 'relative', height: 'auto' }}>
              <div style={{ position: 'sticky', top: 0, background: 'white', padding: '32px 0' }}>
                <h3>创建视图</h3>
                <ViewForm getViewsData={getViewsData} />
              </div>
              <div className='flex-1x'>
                {viewsData.map(view => <ViewForm key={view._id} view={view} getViewsData={getViewsData} />)}
              </div>
            </div>
          </div>
        )}
      </GetViewsData>
    )
  }
}
