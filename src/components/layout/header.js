@observer
export default class Header extends Component {
  render() {
    return (
      <header id='header'>
        {app.ui.header}
        {app.ui.text}
      </header>
    )
  }
}
