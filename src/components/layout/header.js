import { Link } from 'react-router-dom'

@observer
export default class Header extends Component {
  render() {
    return (
      <header id='header'>
        {app.ui.header}
        {app.ui.text}
        <div>
          <Link to='/'>home</Link>
          <Link to='/about'>about</Link>
        </div>
      </header>
    )
  }
}
