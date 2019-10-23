import PivotTableUI from '../../forks/react-pivottable/src/PivotTableUI'
import TableRenderers from '../../forks/react-pivottable/src/TableRenderers'
import createPlotlyRenderers from '../../forks/react-pivottable/src/PlotlyRenderers'
import createPlotlyComponent from 'react-plotly.js/factory'
import '../../forks/react-pivottable/src/pivottable.css'

const Plot = createPlotlyComponent(window.Plotly)
const PlotlyRenderers = createPlotlyRenderers(Plot)

class GetCoreData extends Component {
  state = {
    loading: true,
    coreData: undefined,
    collectionName: undefined,
    collectionOverview: undefined,
  }

  async componentDidMount() {
    const { data: coreData } = await app.axios.get('/core')
    const collectionName = _.chain(app.route.location.pathname).split('/').nth(-2).value()
    const collectionOverview = _.get(coreData, `overview.collections.${collectionName}`)
    this.setState({ loading: false, coreData, collectionName, collectionOverview })
  }

  render() {
    const { loading, coreData, collectionName, collectionOverview } = this.state
    if (loading) return <div>读取中。。。</div>
    return this.props.children({ coreData, collectionName, collectionOverview })
  }
}

class GetCollectionData extends Component {
  state = {
    loading: true,
    coreData: this.props.coreData,
    collectionName: this.props.collectionName,
    collectionOverview: this.props.collectionOverview,
    collectionData: undefined,
  }

  async componentDidMount() {
    const { collectionName } = this.props
    const { data: collectionData } = await app.axios.get(`/views/${collectionName}`)
    this.setState({ loading: false, collectionData })
  }

  render() {
    const { loading, coreData, collectionName, collectionOverview, collectionData } = this.state
    if (loading) return <div>读取中。。。</div>
    return this.props.children({ coreData, collectionName, collectionOverview, collectionData })
  }
}

class PivotTest extends Component {
  componentDidMount () {
    $(this.refs.output).pivotUI(
      [
        { color: "blue", shape: "circle" },
        { color: "red", shape: "triangle" }
      ],
      {
        rows: ["color"],
        cols: ["shape"]
      }
    )
  }

  render() {
    return (
      <div ref='output'></div>
    )
  }
}

export default class extends Component {
  mapPivotProps = children => ({ coreData, collectionName, collectionOverview, collectionData }) => {
    const { data, pivot: { rows, cols } = {} } = collectionData
    return children({
      coreData,
      collectionData,
      data,
      rows,
      cols,
    })
  }

  render() {
    return (
      <GetCoreData>
        {props => (
          <GetCollectionData {...props}>
            {this.mapPivotProps(({ coreData, collectionData, data, rows, cols, rendererName }) => {
              const options = {
                data,
                onChange: s => this.setState(s),
                renderers: Object.assign({}, TableRenderers, PlotlyRenderers)
              }
              if (rows) options.rows = rows
              if (cols) options.cols = cols
              if (!rendererName) options.rendererName = 'Table Heatmap'
              return (
              <PivotTableUI
                  coreData={coreData}
                  collectionData={collectionData}
                  {...options}
                  {...this.state}
                />
              )
            })}
          </GetCollectionData>
        )}
      </GetCoreData>
    )
  }
}
