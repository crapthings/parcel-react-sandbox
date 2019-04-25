@observer
export default class Main extends Component {
  render() {
    return (
      <main id='main' style={{
        marginLeft: app.ui.modal.aside ? '240px' : '0px',
        transition: 'all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
      }}>
        {this.props.children}
      </main>
    )
  }
}
