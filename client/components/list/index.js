@observer
export default class List extends Component {
  render() {
    return (
      <div id='list'>
        <App.Axios name='list' url='list'>
          {({ result: { list } }, { refresh, refreshToken }) => {
            return (
              <div>
                <button onClick={refresh}>refresh {refreshToken}</button>
                {list.map(item => {
                  return (
                    <div key={item._id}>
                      <div>{item.title}</div>
                      <div>{item.desc}</div>
                    </div>
                  )
                })}
              </div>
            )
          }}
        </App.Axios>
      </div>
    )
  }
}
