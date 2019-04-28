@observer
export default class List extends Component {
  render() {
    return (
      <div id='list'>
        <Axios name='list' url='list'>
          {(data, { refresh, refreshToken }) => {
            return (
              <div>
                <button onClick={refresh}>refresh {refreshToken}</button>
                {data.map(item => {
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
        </Axios>
      </div>
    )
  }
}
