@observer
export default class Home extends Component {
  render() {
    return (
      <div id='home'>
        <h1>Home</h1>
        <p>{app.ui.header}</p>
        <p>{app.ui.aside}</p>
        <p>{app.ui.main}</p>
        <p>{app.ui.text}</p>
      </div>
    )
  }
}
