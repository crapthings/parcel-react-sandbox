import  * as something from 'mobx-react-lite'

console.log(something)

export default function Axios(func) {

  const hoc = component => props => {

    @observer
    class component extends Component {
      @observable loading = true
      @observable err = null
      @observable result = null

      componentDidMount() {
        this.fetch()
      }

      @action
      fetch = async () => {
        const { data: { err, result } } = await func()

        if (err) {
          return this.err = err
        }

        this.result = result
        this.loading = false
      }

      renderLoading = () => {
        return <div>loading</div>
      }

      renderErr = () => {
        return <div>{this.err}</div>
      }

      render() {
        if (this.loading) {
          return this.renderLoading()
        } else if (this.err) {
          return this.renderErr()
        } else {
          return component.prototype.render.apply(this, arguments)
        }
      }
    }

    const newProps = {
      ...props,
    }

    return createElement(component, props)

  }

  return hoc

}
