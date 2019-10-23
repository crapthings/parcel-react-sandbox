import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ImageIcon from '@material-ui/icons/Image'
import WorkIcon from '@material-ui/icons/Work'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}))

function FolderList(props) {
  const classes = useStyles()

  return (
    <List className={classes.root}>
      {props.views.map(view => (
        <ListItem onClick={view.onClick}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={view.name} secondary={view.desc} />
        </ListItem>
      ))}
    </List>
  )
}

export default class Index extends Component {
  state = {
    loading: true,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { data } = await app.axios.get(`/core`)
    let { data: views } = await app.axios.get(`/settings/views`)
    views = views.map(item => {
      item.name = _.first(item.script.split('\n'))
      return item
    })
    this.setState({
      loading: false,
      data,
      views,
    })
  }

  render() {
    if (this.state.loading) {
      return <div>loading</div>
    }

    const { data: { overview, settings, counts, storageSize }, views } = this.state

    const _views = _.chain(overview.collections)
      .reject(v => _.get(settings, `${v.name}.isDisabled`) === true)
      .map(v => {
        const urlName = v.name
        v.desc = _.get(settings, `${v.name}.desc`)
        v.name = _.get(settings, `${v.name}.label`, v.name)
        v.onClick = () => {
          app.route.push(`/collections/${urlName}/grid`)
        }
        return v
      })
      .concat(views.map(v => {
        v.onClick = () => {
          app.route.push(`/views/${v._id}/pivot`)
        }
        return v
      }))
      .value()

    return (
      <div>
        <FolderList views={_views} />

        {false && _.map(overview.collections, (collection, key) => (
          <div key={key}>
            <h3>{_.get(settings, `${collection.name}.label`, collection.name)} {_.get(counts, `${collection.name}`)} {_.get(storageSize, `${collection.name}`)}</h3>
            <Link to={`/collection/${collection.name}/grid`}>表格</Link>
            <Link to={`/collection/${collection.name}/pivot`}>pivot</Link>
            <div>{_.get(settings, `${collection.name}.desc`, '暂无描述')}</div>
          </div>
        ))}

        {false && _.map(views, view => (
          <div key={view._id}>
            <h3>{view.name}</h3>
            <Link to={`/views/${view._id}/grid`}>表格</Link>
            <Link to={`/views/${view._id}/pivot`}>pivot</Link>
          </div>
        ))}
      </div>
    )
  }
}
