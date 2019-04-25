import { Link } from 'react-router-dom'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}

@MUI.withStyles(styles)
@observer
export default class Header extends Component {
  render() {
    const { classes } = this.props
    return (
      <MUI.AppBar position='static'>
        <MUI.Toolbar>
          <MUI.IconButton onClick={() => app.ui.modal.aside = !app.ui.modal.aside} className={classes.menuButton} color='inherit'>
            <MUI.Icon>menu</MUI.Icon>
          </MUI.IconButton>

          <div className={classes.grow}></div>

          <div>
            <MUI.IconButton color='inherit' onClick={() => app.route.push('/about')}>
              <MUI.Badge badgeContent={4} color='secondary'>
                <MUI.Icon>star</MUI.Icon>
              </MUI.Badge>
            </MUI.IconButton>
          </div>

          <MUI.Button onClick={() => app.ui.modal.login = !app.ui.modal.login} color='inherit'>
            Login
          </MUI.Button>
        </MUI.Toolbar>
      </MUI.AppBar>
    )
  }
}
