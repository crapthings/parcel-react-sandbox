export default function Axios(func) {
  return function decorator(WrappedComponent) {
    @observer
    class WrapperComponent extends WrappedComponent {
      @observable loading = true
      @observable err = null
      @observable result = null

      componentWillMount() {
        this.fetch()
        if (WrappedComponent.prototype.componentWillMount) {
          WrappedComponent.prototype.componentWillMount.apply(this, arguments)
        }
      }

      @action fetch = async () => {
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
          return WrappedComponent.prototype.render.apply(this, arguments)
        }
      }
    }
    return WrapperComponent
  }
}
