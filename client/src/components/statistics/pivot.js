import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
import TableRenderers from 'react-pivottable/TableRenderers'
import createPlotlyComponent from 'react-plotly.js/factory'
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'

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
    const { data: collectionData } = await app.axios.get(`/statistics/${collectionName}`)
    this.setState({ loading: false, collectionData })
  }

  render() {
    const { loading, coreData, collectionName, collectionOverview, collectionData } = this.state
    if (loading) return <div>读取中。。。</div>
    return this.props.children({ coreData, collectionName, collectionOverview, collectionData })
  }
}

export default class extends Component {
  mapPivotProps = children => ({ coreData, collectionName, collectionOverview, collectionData }) => {
    const data = collectionData.docs
    return children({
      data,
    })
  }

  render() {
    return (
      <GetCoreData>
        {props => (
          <GetCollectionData {...props}>
            {this.mapPivotProps(({ data }) => (
              <PivotTableUI
                data={data}
                onChange={s => this.setState(s)}
                renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                {...this.state}
              />
            ))}
          </GetCollectionData>
        )}
      </GetCoreData>
    )
  }
}
