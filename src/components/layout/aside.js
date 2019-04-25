const drawerWidth = 240

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }
})

@MUI.withStyles(styles, { withTheme: true })
@observer
export default class Aside extends Component {
  render() {
    const { classes, theme } = this.props
    return (
      <MUI.Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={app.ui.modal.aside}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <MUI.IconButton>
            <MUI.Icon>star</MUI.Icon>
          </MUI.IconButton>
        </div>
        <MUI.Divider />
      </MUI.Drawer>
    )
  }
}
