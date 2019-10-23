import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'
import 'ag-grid-enterprise'

export default class Index extends Component {
  state = {
    loading: true
  }

  async componentDidMount() {
    await this.init()
  }

  init = async () => {
    const collectionName = this.getCollectionName()
    const coreData = await this.getCoreData(collectionName)
    const collectionOptions = _.get(coreData, `settings.${collectionName}`)
    const gridOptions = await this.getGridOptions({ collectionName, coreData, collectionOptions })
    this.setState({ loading: false, gridOptions })
  }

  getCollectionName = () => {
    return _.chain(app.route.location.pathname).split('/').nth(-2).value()
  }

  getCoreData = async collectionName => {
    const { data } = await app.axios.get(`/core`)
    return data
  }

  getGridOptions = async ({ collectionName, coreData, collectionOptions }) => {
    const gridOptions = {}

    if (collectionOptions.limit) {
      gridOptions.rowModelType = 'serverSide'
      gridOptions.pagination = true
      gridOptions.paginationPageSize = collectionOptions.limit
      gridOptions.onGridReady = params => {
        this.gridApi = params.api
        this.gridApi.setServerSideDatasource({
          getRows: this.getRows({ collectionName, coreData })
        })
      }
    } else {
      const { data } = await app.axios.get(`/statistics/${collectionName}`)
      gridOptions.columnDefs = this.getColumnDefs({ collectionName, coreData, data })
      gridOptions.rowData = data.docs
      gridOptions.onGridReady = params => {
        this.gridApi = params.api
        this.gridApi.sizeColumnsToFit()
      }
    }

    return gridOptions
  }

  getColumnDefs = ({ collectionName, coreData, data }) => {
    return _.chain(coreData)
      .get(`overview.collections.${collectionName}.fields`)
      .omitBy(field => _.get(coreData, `settings.${collectionName}.fields.${field}.isUnImportant`))
      .map(field => {
        const result = {
          field,
          headerName: _.get(coreData, `settings.${collectionName}.fields.${field}.label`, field),
          sortable: true,
          filter: true,
        }

        const formatter = _.get(coreData, `settings.${collectionName}.fields.${field}.formatter`)

        if (formatter) {
          result.valueGetter = cell => {
            return eval(formatter)
          }
        }

        const primaryCollection = _.get(coreData, `settings.${collectionName}.fields.${field}.primaryCollection`)
        const displayField = _.get(coreData, `settings.${collectionName}.fields.${field}.displayField`)

        if (displayField) {
          result.valueGetter = cell => {
            const celldata = _.get(cell, `data.${field}`)
            return _.get(data, `refDocs.${primaryCollection}.${celldata}.${displayField}`)
          }
        }

        return result
      })
      .value()
  }

  getRows = ({ collectionName, coreData }) => async params => {
    const { request: { startRow, endRow } } = params
    const { data } = await app.axios.get(`/statistics/${collectionName}`, { params: { startRow, endRow } })
    this.gridApi.setColumnDefs(this.getColumnDefs({ collectionName, coreData, data }))
    params.successCallback(data.docs, data.metadata.count)
    // this.gridApi.sizeColumnsToFit()
  }

  render() {
    const { loading, gridOptions } = this.state

    if (loading) {
      return <div>loading</div>
    }

    return (
      <div className='ag-theme-balham'>
        <AgGridReact {...gridOptions} />
      </div>
    )
  }
}
