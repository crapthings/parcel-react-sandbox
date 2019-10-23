import TextareaAutosize from 'react-textarea-autosize'

class BoardForm extends Component {
  onSubmit = async evt => {
    evt && evt.preventDefault()
    await this.save()
  }

  save = async () => {
    const cards = _.map($(this.refs.grid).find('.grid-stack-item:visible'), item => {
      const { x, y, width, height } = $(item).data('_gridstack_node')
      const result = { x, y, width, height }
      if (item.viewId) result.viewId = item.viewId
      if (item.imageUrl) result.imageUrl = item.imageUrl
      if (item.iconName) result.iconName = item.iconName
      return result
    })

    if (this.props.board) {
      await app.axios.put('/settings/boards', { _id: this.props.board._id, cards })
    } else {
      await app.axios.post('/settings/boards', { cards })
      this.grid.data('gridstack').removeAll()
    }

    this.props.getBoardsData()
  }

  onRemove = _id => async evt => {
    if (!confirm('确定要删除吗')) return
    await app.axios.delete('/settings/boards', { data: { _id } })
    this.props.getBoardsData()
  }

  componentDidMount() {
    this.grid = $(this.refs.grid).gridstack({
      float: true,
    })

    this.grid.data('gridstack').removeAll()

    if (this.props.board && this.props.board.cards) {
      let cards = this.props.board.cards || GridStackUI.Utils.sort(this.props.board.cards)
      cards.forEach(card => {
        this.addWidget(card)()
      })
    }

    this.grid.on('change', (event, items) => {
      console.log(event, items)
      if (event.target.tagName === 'SELECT') return
      if (event.target.tagName === 'INPUT') return
      if (this.props.board) this.onSubmit()
    })
  }

  addWidget = ({ element, x = 0, y = 0, width = 1, height = 2, autopos, viewId, imageUrl, iconName } = {}) => evt => {
    const self = this

    const widget = $('<div><div class="grid-stack-item-content" /></div>')
    widget[0].viewId = viewId
    widget[0].imageUrl = imageUrl
    widget[0].iconName = iconName

    const widgetForm = $('<div class="widget-form"></div>')

    //
    const toggleWidgetFormBtn = $('<button>toggle</button>').on('click', function () {
      widgetForm.toggle()
    })

    $(widget).append(toggleWidgetFormBtn)
    //

    //
    const closeWidgetFormBtn = $('<button>close</button>').on('click', function () {
      widgetForm.hide()
    })

    $(widgetForm).append(closeWidgetFormBtn)
    //

    //
    const RemoveWidgetBtn = $('<button>remove</button>').on('click', function () {
      self.grid.data('gridstack').removeWidget(this.parentNode)
    })

    $(widget).append(RemoveWidgetBtn)
    //

    if (this.props.viewsData) {
      // selector form
      const widgetSelector = $('<select></select>')
      const widgetSelectorOptionNone = $(`<option value=""></option>`)

      $(widgetSelector).append(widgetSelectorOptionNone)

      this.props.viewsData.forEach(view => {
        const widgetSelectorOptions = $(`<option value="${view._id}">${view.name}</option>`)
        if (viewId === view._id) {
          widgetSelectorOptions.attr('selected','selected')
        }
        $(widgetSelector).append(widgetSelectorOptions)
      })

      widgetSelector.on('change', async function () {
        this.parentNode.viewId = this.value
        await self.save()
      })

      // start of image url
      const widgetImageUrl = $('<input type="text" placeholder="图片链接" />')

      if (imageUrl) {
        widgetImageUrl[0].value = imageUrl
      }

      widgetImageUrl.on('change', async function () {
        this.parentNode.parentNode.imageUrl = this.value
        await self.save()
      })

      $(widgetForm).append(widgetImageUrl)
      // end of image url

      // start of icon name
      const widgetIconName = $('<input type="text" placeholder="图标名称" />')

      if (iconName) {
        widgetIconName[0].value = iconName
      }

      widgetIconName.on('change', async function () {
        this.parentNode.parentNode.iconName = this.value
        await self.save()
      })

      $(widgetForm).append(widgetIconName)
      // end of icon name

      $(widget).append(widgetForm)
      $(widget).append(widgetSelector)

    }

    this.grid.data('gridstack').addWidget(widget, x, y, width, height, autopos)
  }

  render() {
    const { board } = this.props
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <button type='button' onClick={this.addWidget({ autopos: true })}>add</button>
          {board && <button type='button' onClick={this.onRemove(board._id)}>remove</button>}
          {board && <a href={`/boards/${board._id}`} target='_blank'>preview</a>}
          <input type='submit' />
        </div>
        <div ref='grid' className='grid-stack grid-stack-N'></div>
      </form>
    )
  }
}

class GetBoardsData extends Component {
  state = {
    loading: true,
    viewsData: undefined,
    boardsData: undefined,
  }

  componentDidMount() {
    this.getBoardsData()
  }

  getBoardsData = async () => {
    let { data: viewsData } = await app.axios.get('/settings/views')
    const { data: boardsData } = await app.axios.get('/settings/boards')
    _.map(viewsData, view => {
      view.name = _.first(view.script.split('\n'))
      return view
    })
    this.setState({ loading: false, viewsData, boardsData })
  }

  render() {
    const { loading, viewsData, boardsData } = this.state
    const { getBoardsData } = this

    if (loading) return <div>读取中。。。</div>

    return this.props.children({ viewsData, boardsData, getBoardsData })
  }
}

export default class extends Component {
  render() {
    return (
      <GetBoardsData>
        {({ viewsData, boardsData, getBoardsData }) => (
          <div className='pd-md' style={{ height: 'auto' }}>
            <h3>create board</h3>
            <BoardForm getBoardsData={getBoardsData} />
            <h3>boards</h3>
            {boardsData.map(board => <BoardForm key={board._id} viewsData={viewsData} board={board} getBoardsData={getBoardsData} />)}
          </div>
        )}
      </GetBoardsData>
    )
  }
}
