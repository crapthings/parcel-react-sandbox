import prettyBytes from 'pretty-bytes'
import { render } from 'react-dom'

import CountUp from 'react-countup'

class Timeline1Widget extends Component {
  state = {
    height: undefined,
  }

  componentDidMount() {
    const { width, height } = this.refs.container.getBoundingClientRect()
    this.setState({ width, height }, () => {
      this.run()
    })
  }

  run = () => {
    anime({
      targets: '.message',
      translateX: -(this.state.width + 500),
      direction: 'alternate',
      loop: true,
      duration: 300000,
      delay: function(el, i, l) {
        return i * _.random(5000, 6000)
      },
      endDelay: function(el, i, l) {
        return (l - i) * _.random(5000, 6000)
      }
    })
  }

  render() {
    const { width, height } = this.state
    return (
      <div ref='container' className='fit'>{height && this.props.data.data.map(message => (
        <div
          style={{ position: 'absolute', top: 0, left: 0, transform: `translate(${width}px, ${_.random(50, height - 50)}px)` }}
          className='message'
        >
          ***于{moment(message.createdAt).format('YYYY年M月D日H:M')}{message.name}
        </div>
      ))}</div>
    )
  }
}

class Timeline2Widget extends Component {
  componentDidMount() {
am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var container = am4core.create("chartdiv", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);

var interfaceColors = new am4core.InterfaceColorSet();
var colorSet = new am4core.ColorSet();

var chart = container.createChild(am4plugins_timeline.CurveChart);

chart.data = [{
  "start": "2019-11-10 08:00",
  "end": "2019-11-10 17:00",
  "task": "Official workday"
}, {
  "start": "2019-11-10 06:00",
  "end": "2019-11-10 11:00",
  "task": "Gathering requirements",
  "bulletf1":false
}, {
  "start": "2019-11-10 11:30",
  "end": "2019-11-10 16:30",
  "task": "Development"
},{
  "start": "2019-11-10 16:00",
  "end": "2019-11-10 18:00",
  "task": "Producing specifications"
}, {
  "start": "2019-11-10 13:00",
  "end": "2019-11-11 01:00",
  "task": "Testing",
  "bulletf2":false
},{
  "task": ""
} ].reverse();

chart.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm";
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm";
chart.dy = 90;
chart.maskBullets = false;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "task";
categoryAxis.renderer.labels.template.paddingRight = 25;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.innerRadius = 0;
categoryAxis.renderer.radius = 100;
categoryAxis.renderer.grid.template.location = 1;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 70;
dateAxis.min = new Date("2019-11-10 05:00").getTime();
dateAxis.max = new Date("2019-11-11 02:00").getTime();

dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
dateAxis.startLocation = -0.5;

dateAxis.renderer.points = [{ x: -400, y: 0 }, { x: -250, y: 0 }, { x: 0, y: 60 }, { x: 250, y: 0 }, { x: 400, y: 0 }];
dateAxis.renderer.autoScale = false;
dateAxis.renderer.polyspline.tensionX = 0.8;
dateAxis.renderer.tooltipLocation = 0;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.7;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 7;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.7;
labelTemplate.background.fill = interfaceColors.getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7,7,7,7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(15);
series.columns.template.tooltipText = "{categoryX}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

series.dataFields.openDateX = "start";
series.dataFields.dateX = "end";
series.dataFields.categoryY = "task";
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 0;

series.columns.template.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

var flagBullet1 = new am4plugins_bullets.FlagBullet();
series.bullets.push(flagBullet1);
flagBullet1.disabled = true;
flagBullet1.propertyFields.disabled = "bulletf1";
flagBullet1.locationX = 1;
flagBullet1.label.text = "start";

var flagBullet2 = new am4plugins_bullets.FlagBullet();
series.bullets.push(flagBullet2);
flagBullet2.disabled = true;
flagBullet2.propertyFields.disabled = "bulletf2";
flagBullet2.locationX = 0;
flagBullet2.background.fill = interfaceColors.getFor("background");
flagBullet2.label.text = "end";

var bullet = new am4charts.CircleBullet();
series.bullets.push(bullet);
bullet.circle.radius = 3;
bullet.circle.strokeOpacity = 0;
bullet.locationX = 0;

bullet.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

var bullet2 = new am4charts.CircleBullet();
series.bullets.push(bullet2);
bullet2.circle.radius = 3;
bullet2.circle.strokeOpacity = 0;
bullet2.propertyFields.fill = "color";
bullet2.locationX = 1;

bullet2.adapter.add("fill", function (fill, target) {
   return chart.colors.getIndex(target.dataItem.index * 3);
})

// chart.scrollbarX = new am4core.Scrollbar();
// chart.scrollbarX.align = "center"
// chart.scrollbarX.width = 800;
// chart.scrollbarX.parent = chart.bottomAxesContainer;
// chart.scrollbarX.dy = - 90;
// chart.scrollbarX.opacity = 0.4;

var cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false;


/// clock
var clock = container.createChild(am4charts.GaugeChart);
clock.toBack();

clock.radius = 120;
clock.dy = -100;
clock.startAngle = -90;
clock.endAngle = 270;

var axis = clock.xAxes.push(new am4charts.ValueAxis());
axis.min = 0;
axis.max = 12;
axis.strictMinMax = true;

axis.renderer.line.strokeWidth = 1;
axis.renderer.line.strokeOpacity = 0.5;
axis.renderer.line.strokeDasharray = "1,4";
axis.renderer.minLabelPosition = 0.05; // hides 0 label
axis.renderer.inside = true;
axis.renderer.labels.template.radius = 30;
axis.renderer.grid.template.disabled = true;
axis.renderer.ticks.template.length = 12;
axis.renderer.ticks.template.strokeOpacity = 1;

// serves as a clock face fill
var range = axis.axisRanges.create();
range.value = 0;
range.endValue = 12;
range.grid.visible = false;
range.tick.visible = false;
range.label.visible = false;

var axisFill = range.axisFill;

// hands
var hourHand = clock.hands.push(new am4charts.ClockHand());
hourHand.radius = am4core.percent(60);
hourHand.startWidth = 5;
hourHand.endWidth = 5;
hourHand.rotationDirection = "clockWise";
hourHand.pin.radius = 8;
hourHand.zIndex = 1;

var minutesHand = clock.hands.push(new am4charts.ClockHand());
minutesHand.rotationDirection = "clockWise";
minutesHand.startWidth = 3;
minutesHand.endWidth = 3;
minutesHand.radius = am4core.percent(78);
minutesHand.zIndex = 2;

chart.cursor.events.on("cursorpositionchanged", function (event) {
   var value = dateAxis.positionToValue(event.target.xPosition)
   var date = new Date(value);
   var hours = date.getHours();
   var minutes = date.getMinutes();
   // set hours
   hourHand.showValue(hours + minutes / 60, 0);
   // set minutes
   minutesHand.showValue(12 * minutes/ 60, 0);
})

}); // end am4core.ready()
  }

  render() {
    return (
      <div id='chartdiv'></div>
    )
  }
}

class HcColumnChartWidget extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      chart: {
        type: 'column',
        // backgroundColor: 'transparent',
      },
      title: {
        text: this.props.data.title,
        align: 'left',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: false,
        // tickInterval: 1,
        gridLineColor: '#e1bee7',
        gridLineDashStyle: 'Dot',
      },
      series: [{
        data: this.props.data.data,
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
      }],
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none'
          }
        }
      },
      legend: false,
      tooltip: false,
      credits: false,
    })
  }

  render() {
    return (
      <div className='flex-column fit'>
        <div className='flex-1x' ref='chart' />
      </div>
    )
  }
}

class HcLineChartWidget extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      chart: {
        type: 'line',
        // backgroundColor: 'transparent',
      },
      title: {
        text: this.props.data.title,
        align: 'left',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: false,
        // tickInterval: 1,
        gridLineColor: '#e1bee7',
        gridLineDashStyle: 'Dot',
      },
      series: [{
        data: this.props.data.data,
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
      }],
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            crop: false,
            overflow: 'none',
            formatter: function() {
              return this.y.abbr(1)
            }
          }
        }
      },
      legend: false,
      tooltip: false,
      credits: false,
    })
  }

  render() {
    return (
      <div className='flex-column fit'>
        <div className='flex-1x' ref='chart' />
      </div>
    )
  }
}

class HcPieChartWidget extends Component {
  componentDidMount() {
    this.renderChart()
  }

  renderChart = () => {
    this.chart = Highcharts.chart(this.refs.chart, {
      chart: {
        type: 'pie',
        // backgroundColor: 'transparent',
      },
      title: {
        text: this.props.data.title,
        align: 'left',
      },
      xAxis: {
        type: 'category',
      },
      series: [{
        data: this.props.data.data,
      }],
      plotOptions: {
        pie: {
          colors: (function () {
    var colors = [],
        base = '#7b1fa2',
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 5).get());
    }
    return colors;
}()),
          showInLegend: true,
          dataLabels: {
            enabled: true,
            formatter: function() {
              const name = this.point.name === 'undefined' ? '未知' : this.point.name
              return `${name}, ${this.y.abbr(1)}`
            }
          },
        }
      },
      legend: false,
      tooltip: false,
      credits: false,
    })
  }

  render() {
    return (
      <div className='flex-column fit'>
        <div className='flex-1x' ref='chart' />
      </div>
    )
  }
}

class TextWidget extends Component {
  render() {
    const { data: { title, data }, widget: { x, y, width, height }, iconName } = this.props
    return (
      <div className='flex-column fit' style={{ position: 'relative', overflow: 'hidden' }}>
        {iconName && <div className='fit' style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', opacity: '.2' }}>
          <i className={`mdi mdi-${iconName} mgr`} style={{ fontSize: '8em' }} />
        </div>}
        <div className='flex flex-3x' style={{ alignItems: 'flex-end', padding: '0 0 8px 16px' }}>
          <span style={{ fontSize: '2.6em' }}>
            {width < 2
              ? (data.toString().length < 4 ? <CountUp end={data} duration={2} /> : data.abbr(1))
              : <CountUp end={data} duration={1} />
            }
          </span>
        </div>
        <div className='flex flex-2x' style={{ paddingLeft: '16px' }}>
          <span style={{ fontSize: '1em' }}>{title}</span>
        </div>
      </div>
    )
  }
}

class Widget extends Component {
  state = {
    loading: true,
  }

  async componentDidMount() {
    const { viewId, imageUrl, iconName } = this.props
    if (viewId) {
      const { data } = await app.axios.get(`/views/${viewId}`, {
        timeout: 0,
      })
      this.setState({ loading: false, data, imageUrl, iconName })
    } else {
      this.setState({ loading: false, data: {}, imageUrl, iconName })
    }
  }

  render() {
    const { loading, data, imageUrl, iconName } = this.state

    if (loading) {
      return (
        <div className='flex-column fit' style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className='lds-heart'><div></div></div>
        </div>
      )
    }

    if (imageUrl) {
      return <div className='fit' style={{
        backgroundImage: `url("${imageUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}></div>
    }

    const { widget } = this.props
    const { chartType } = data

    if (chartType === 'text') {
      return <TextWidget data={data} widget={widget} iconName={iconName} />
    } else if (chartType === 'column') {
      return <HcColumnChartWidget data={data} widget={widget} />
    } else if (chartType === 'line') {
      return <HcLineChartWidget data={data} widget={widget} />
    } else if (chartType === 'pie') {
      return <HcPieChartWidget data={data} widget={widget} />
    } else if (chartType === 'timeline1') {
      return <Timeline1Widget data={data} widget={widget} />
    } else {
      return <div>未定义显示类型</div>
    }
  }
}

class GetBoardData extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    const _id = _.chain(app.route.location.pathname).split(/\//).last().value()
    const { data: board } = await app.axios.get(`/boards/${_id}`)
    this.setState({ loading: false, board })
  }

  render() {
    const { loading, board } = this.state

    if (loading) return <div>读取中。。。</div>

    return this.props.children({ board })
  }
}

class Grid extends Component {
  componentDidMount() {
    const { board } = this.props

    this.grid = $(this.refs.grid).gridstack({
      float: true,
      staticGrid: true,
    })

    _.chain(board)
      .get('cards', [])
      .filter(({ viewId, imageUrl }) => {
        if (viewId || imageUrl)
          return true
        else
          return false
      })
      .value()
      .forEach(({ x, y, width, height, viewId, imageUrl, iconName }) => {
        const widget = $('<div><div class="grid-stack-item-content" /></div>')
        render(<Widget viewId={viewId} imageUrl={imageUrl} iconName={iconName} widget={{ x, y, width, height }} />, widget.find('.grid-stack-item-content')[0])
        this.grid.data('gridstack').addWidget(widget, x, y, width, height, false)
      })
  }

  render() {
    return (
      <div style={{ padding: '20px 10px' }}>
        <div ref='grid' className='grid-stack'></div>
      </div>
    )
  }
}

export default class extends Component {
  render() {
    return (
      <GetBoardData>
        {({ board }) => (
          <Grid board={board} />
        )}
      </GetBoardData>
    )
  }
}
