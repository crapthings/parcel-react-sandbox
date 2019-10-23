class LineChartForCard1 extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      credits: false,
      title: false,
      subtitle: false,
      legend: false,
      chart: {
        backgroundColor: 'transparent',
        spacing: [0, 0, 0, 0],
      },
      xAxis: {
        title: false,
        labels: false,
        tickInterval: 1,
        lineColor: '#e1bee7',
        tickLength: 0,
      },
      yAxis: {
        title: false,
        labels: false,
        tickInterval: 1,
        gridLineColor: 'transparent',
        gridLineDashStyle: 'Dot',
      },
      series: [
        {
          type: 'area',
          color: '#7b1fa2',
          data: this.props.data,
        },
      ],
    })
  }

  render() {
    return (
      <div className='fit' ref='chart' />
    )
  }
}

class CardGroup1 extends Component {
  render() {
    const {
      countGroupsByType,
      countUsersByType,
      countIssuesByIsOpen,
      countActivitiesByType,
      activitiesSumByLatest7Days,
    } = this.props

    return (
      <div className='card-group-1'>
        <div className="div1">
          <div style={{ fontSize: '2.2em', padding: '32px 32px 0px 32px' }}>{countGroupsByType.total} 节点</div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countGroupsByType.机构}</span>
              <span>机构</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countGroupsByType.部门}</span>
              <span>部门</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countGroupsByType.项目}</span>
              <span>项目</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countGroupsByType.分支机构}</span>
              <span>分支机构</span>
            </div>
          </div>
        </div>
        <div className="div2">
          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.客户经理}</span>
              <span>客户经理</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.法务}</span>
              <span>法务</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.客户操作员}</span>
              <span>客户操作员</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.律师}</span>
              <span>律师</span>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1 }}>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.助理律师}</span>
              <span>助理律师</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.律所行政}</span>
              <span>律所行政</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.访客}</span>
              <span>访客</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countUsersByType.根组织机构虚拟用户}</span>
              <span>虚拟用户</span>
            </div>
          </div>
        </div>
        <div className="div3">
          <div style={{ fontSize: '2.2em', padding: '32px 32px 0px 32px' }}>{countIssuesByIsOpen.total} 事务</div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countIssuesByIsOpen.进行中}</span>
              <span>进行中</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4em', marginBottom: '8px' }}>{countIssuesByIsOpen.已完成}</span>
              <span>已完成</span>
            </div>
          </div>
        </div>
        <div className="div4">
          <div style={{ fontSize: '2.2em', padding: '32px 32px 16px 32px' }}>{countActivitiesByType.total} 动态</div>
          <div>
            <LineChartForCard1 data={activitiesSumByLatest7Days} />
          </div>
        </div>
      </div>
    )
  }
}

class BarChartForCard2 extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      credits: false,
      title: false,
      subtitle: false,
      legend: false,
      chart: {
        backgroundColor: 'transparent',
        spacing: [8, 8, 16, 8],
      },
      xAxis: {
        title: false,
        // labels: false,
        tickInterval: 1,
        lineColor: '#e1bee7',
        tickLength: 0,
        categories: _.map(this.props.data, 'name'),
      },
      yAxis: {
        title: false,
        labels: false,
        tickInterval: 1,
        gridLineColor: 'transparent',
        gridLineDashStyle: 'Dot',

      },
      series: [
        {
          type: 'bar',
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ba68c8'],
              [1, '#7b1fa2'],
            ],
          },
          data: _.map(this.props.data, 'value'),
        }
      ],
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none'
          }
        }
      },
    })
  }

  render() {
    return (
      <div className='fit' ref='chart' />
    )
  }
}

class CardGroup2 extends Component {
  render() {
    const { issuesCountByGroupId, issuesCountByUsers, top10Issues } = this.props
    return (
      <div className='card-group-2'>
        <div className="div1 flex-column">
          <div className='primary-color' style={{ padding: '16px 16px 8px 16px', fontSize: '1.2em' }}>
            top 10 节点
          </div>
          <BarChartForCard2 data={issuesCountByGroupId} />
        </div>
        <div className="div2 flex-column">
          <div className='primary-color' style={{ padding: '16px 16px 8px 16px', fontSize: '1.2em' }}>
            top 10 用户
          </div>
          <BarChartForCard2 data={issuesCountByUsers} />
        </div>
        <div className="div3 flex-column">
          <div className='primary-color' style={{ padding: '16px 16px 8px 16px', fontSize: '1.2em' }}>
            top 10 事务
          </div>
          <BarChartForCard2 data={top10Issues} />
        </div>
      </div>
    )
  }
}

class LineChart extends Component {
  state = {
    title: '近一个月事务数量'
  }

  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    const {
      issuesSumByCurrentMonth,
      issuesSumByYears,
      issuesSumByCurrentYear,
    } = this.props

    issuesSumByCurrentMonth.categories = _.map(issuesSumByCurrentMonth, '0')
    issuesSumByCurrentMonth.data = _.map(issuesSumByCurrentMonth, '1')

    issuesSumByCurrentYear.categories = _.map(issuesSumByCurrentYear, '0')
    issuesSumByCurrentYear.data = _.map(issuesSumByCurrentYear, '1')

    issuesSumByYears.categories = _.map(issuesSumByYears, '0')
    issuesSumByYears.data = _.map(issuesSumByYears, '1')

    this.chart = Highcharts.chart(this.refs.chart, {
      credits: false,
      title: false,
      subtitle: false,
      legend: false,
      chart: {
        backgroundColor: 'transparent',
      },
      xAxis: {
        title: false,
        tickInterval: 1,
        lineColor: '#e1bee7',
        categories: issuesSumByCurrentMonth.categories
      },
      yAxis: {
        title: false,
        tickInterval: 1,
        gridLineColor: '#e1bee7',
        gridLineDashStyle: 'Dot',
      },
      series: [
        {
          type: 'column',
          color: '#7b1fa2',
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#ba68c8'],
              [1, '#7b1fa2'],
            ],
          },
          data: issuesSumByCurrentMonth.data,
        },
        {
          type: 'spline',
          color: '#7b1fa2',
          data: issuesSumByCurrentMonth.data,
        },
      ],
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none'
          }
        }
      },
    })
  }

  setData = (dataset, title) => evt => {
    this.setState({ title })
    this.chart.series[0].setVisible(false)
    this.chart.series[1].setVisible(false)

    this.chart.series[0].setData(dataset.data)
    this.chart.series[1].setData(dataset.data)
    this.chart.xAxis[0].setCategories(dataset.categories)

    this.chart.series[0].setVisible(true, true)
    this.chart.series[1].setVisible(true, true)
  }

  render() {
    const {
      issuesSumByCurrentMonth,
      issuesSumByCurrentYear,
      issuesSumByYears,
    } = this.props
    return (
      <div className='fit flex-column'>
        <div className='flex' style={{ padding: '16px 16px 16px 16px' }}>
          <span className='primary-color' style={{ marginLeft: '16px', fontSize: '1.5em' }}>
            {this.state.title}
          </span>
          <span className='flex-1'></span>
          <span style={{ marginRight: '16px' }} onClick={this.setData(issuesSumByCurrentMonth, '近一个月事务数量')}>近一个月</span>
          <span style={{ marginRight: '16px' }} onClick={this.setData(issuesSumByCurrentYear, '今年事务数量')}>今年</span>
          <span onClick={this.setData(issuesSumByYears, '历年事务数量')}>历年</span>
        </div>
        <div className='flex-1' ref='chart' />
      </div>
    )
  }
}

class PolarChart extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    const activitiesGroupByType = this.props.data

    this.chart = Highcharts.chart(this.refs.chart, {
      credits: false,
      title: false,
      legend: false,
      chart: {
        polar: true,
        type: 'line',
      },
      pane: {
        size: '64%',
      },
      xAxis: {
        categories: _.map(activitiesGroupByType, 'k'),
        tickmarkPlacement: 'on',
        lineWidth: 0,
        gridLineColor: '#e1bee7',
        gridLineDashStyle: 'Dot',
      },
      yAxis: {
        lineWidth: 0,
        min: 0,
        gridLineInterpolation: 'polygon',
        gridLineColor: '#e1bee7',
        gridLineDashStyle: 'Dot',
      },
      tooltip: {
        shared: true,
        pointFormat:
          '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>',
      },
      series: [
        {
          name: '动态分布图',
          color: '#7b1fa2',
          data: _.map(activitiesGroupByType, 'v'),
          pointPlacement: 'off',
        },
      ],
      plotOptions: {
        polar: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none'
          }
        }
      },
    })
  }

  render() {
    return <div className="fit" ref="chart" />
  }
}

class PieChart extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      credits: false,
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
      },
      title: {
        text: 'Browser market shares in January, 2018',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color:
                (Highcharts.theme && Highcharts.theme.contrastTextColor) ||
                'black',
            },
          },
        },
      },
      series: [
        {
          name: 'Brands',
          colorByPoint: true,
          data: [
            {
              name: 'Chrome',
              y: 61.41,
              sliced: true,
              selected: true,
            },
            {
              name: 'Internet Explorer',
              y: 11.84,
            },
            {
              name: 'Firefox',
              y: 10.85,
            },
            {
              name: 'Edge',
              y: 4.67,
            },
            {
              name: 'Safari',
              y: 4.18,
            },
            {
              name: 'Sogou Explorer',
              y: 1.64,
            },
            {
              name: 'Opera',
              y: 1.6,
            },
            {
              name: 'QQ',
              y: 1.2,
            },
            {
              name: 'Other',
              y: 2.61,
            },
          ],
        },
      ],
    })
  }

  render() {
    return <div className="fit" ref="chart" />
  }
}

export default class Screen1 extends Component {
  state = {
    loading: true,
    countGroupsByType: undefined,
  }

  async componentDidMount() {
    const { data: { result } } = await app.axios.get('/dashboard', {
      timeout: 0
    })
    this.setState({
      loading: false,
      ...result,
    })
  }

  render() {
    if (this.state.loading) {
      return <div>读取中</div>
    }

    const {
      countGroupsByType,
      countUsersByType,
      countIssuesByIsOpen,
      countActivitiesByType,

      issuesSumByCurrentMonth,
      issuesSumByCurrentYear,
      issuesSumByYears,
      issuesCountByGroupId,

      activitiesSumByLatest7Days,
      activitiesGroupByType,

      issuesCountByUsers,
      top10Issues,
    } = this.state

    return (
      <div className="screen1">
        <div className="div1">
          <CardGroup1
            countGroupsByType={countGroupsByType}
            countUsersByType={countUsersByType}
            countIssuesByIsOpen={countIssuesByIsOpen}
            countActivitiesByType={countActivitiesByType}
            activitiesSumByLatest7Days={activitiesSumByLatest7Days}
          />
        </div>
        <div className="div2">
          <LineChart
            issuesSumByCurrentMonth={issuesSumByCurrentMonth}
            issuesSumByCurrentYear={issuesSumByCurrentYear}
            issuesSumByYears={issuesSumByYears}
          />
        </div>
        <div className="div3">
          <CardGroup2
            issuesCountByGroupId={issuesCountByGroupId}
            issuesCountByUsers={issuesCountByUsers}
            top10Issues={top10Issues}
          />
        </div>
        <div className="div4">
          <PolarChart data={activitiesGroupByType} />
        </div>
        <div className="div5">
          <PieChart />
        </div>
      </div>
    )
  }
}

function daysInMonth () {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  return new Date(currentYear, currentMonth, 0).getDate()
}
