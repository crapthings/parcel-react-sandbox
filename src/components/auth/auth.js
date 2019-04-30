import Login from './login'

@observer
class Auth extends Component {
  render() {
    return this.props.children
  }
}

export default Children => () => {
  return (
    <Auth>
      <Children />
    </Auth>
  )
}
