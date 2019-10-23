class TreemapChart extends Component {
  componentDidMount() {
    this.chart = Highcharts.chart(this.refs.chart, {
      title: false,
      credits: false,
      series: [{
        // specific options for this series instance
        type: 'treemap',
        allowDrillToNode: true,
        layoutAlgorithm: 'squarified',
        data: this.props.data,
        // color: {
        //   linearGradient: {
        //     x1: 0,
        //     x2: 0,
        //     y1: 0,
        //     y2: 1
        //   },
        //   stops: [
        //     [0, '#ba68c8'],
        //     [1, '#7b1fa2'],
        //   ],
        // },
      }]
    })
  }

  render() {
    return (
      <div className='flex-column fit'>
        <div>hi</div>
        <div className='flex-1' ref='chart' />
      </div>
    )
  }
}

export default class Screen2 extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    const { data: { result } } = await app.axios.get('/screen2', {
      timeout: 0
    })

    console.log('wtf', result)

    this.setState({
      loading: false,
      ...result,
    })
  }

  render() {
    if (this.state.loading) {
      return <div>读取中</div>
    }

    const { groupsTreemap } = this.state

    return (
      <div className='screen2'>
        <TreemapChart data={groupsTreemap} />
      </div>
    )
  }
}
