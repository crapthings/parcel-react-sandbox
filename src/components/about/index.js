@observer
export default class About extends Component {
  render() {
    return (
      <div id='about'>
        <h1>About</h1>
        <p>{app.ui.header}</p>
        <p>{app.ui.aside}</p>
        <p>{app.ui.main}</p>
        <p>{app.ui.text}</p>
      </div>
    )
  }
}
