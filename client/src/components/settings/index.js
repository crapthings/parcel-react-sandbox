// import smoothscroll from 'smoothscroll-polyfill'
import CInput from 'react-composition-input'

// smoothscroll.polyfill()

class PrimaryKeySelector extends Component {
  state = {
    primaryCollection: this.props.primaryCollection,
    primaryField: this.props.primaryField,
    displayField: this.props.displayField,
  }

  onChange = evt => {
    if (evt.target.name === 'primaryCollection') {
      this.setState({ primaryCollection: evt.target.value })
    }

    if (evt.target.name === 'primaryField') {
      this.setState({ primaryField: evt.target.value })
    }

    if (evt.target.name === 'displayField') {
      this.setState({ displayField: evt.target.value })
    }

    this.props.onChange(evt)
  }

  render() {
    const { data, collection } = this.props
    const { primaryCollection, primaryField, displayField } = this.state
    console.log(displayField)
    return (
      <div>
        <select name='primaryCollection' defaultValue={primaryCollection} onChange={this.onChange}>
          <option />
          {_.map(data.overview.collections, coll => <option key={coll.name} value={coll.name}>{coll.name}</option>)}
        </select>
        {primaryCollection && <select name='primaryField' defaultValue={primaryField} onChange={this.onChange}>
          <option />
          {_.map(data.overview.collections[primaryCollection]['fields'], name => <option key={name} value={name}>{name}</option>)}
        </select>}
        {primaryCollection && <select name='displayField' defaultValue={displayField} onChange={this.onChange}>
          <option />
          {_.map(data.overview.collections[primaryCollection]['fields'], name => <option key={name} value={name}>{name}</option>)}
        </select>}
      </div>
    )
  }
}

class CollectionFormGroup extends Component {
  state = {
    name: _.get(this.props.data, `settings.${this.props.collection.name}.label`, this.props.collection.name)
  }

  changeName = name => {
    this.setState({ name })
  }

  render() {
    const { data, collection } = this.props
    const { name, fields } = collection
    return (
      <div key={name} className='flex-row'>
        <div className='flex-column flex-right flex-1x pd'>
          <div>{name}</div>
        </div>
        <div className='flex-11x pd-sm'>
          <div className='mgb'>
            <Link to={`/statistics/${name}`} target='_blank'>
              <span className='title' id={`${name}`}>{this.state.name}</span>
            </Link>
          </div>

          <div className='mgb'>
            <table>
              <thead>
                <tr>
                  <th className='pd-sm' width='100'>表名</th>
                  <th className='pd-sm'>中文名</th>
                  <th className='pd-sm'>描述</th>
                  <th className='pd-sm'>不参与统计</th>
                  <th className='pd-sm'>可装载到内存</th>
                  <th className='pd-sm'>每页数量（表形式）</th>
                </tr>
              </thead>
              <tbody>
                {CollectionFormItemWrapper({ data, collection, name, changeName: this.changeName })}
              </tbody>
            </table>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th className='pd-sm' width='400'>字段名</th>
                  <th className='pd-sm' width='120'>中文名</th>
                  <th className='pd-sm' width='100'>类型</th>
                  <th className='pd-sm'>主键</th>
                  <th className='pd-sm'>不参与统计</th>
                  <th className='pd-sm'>不投射</th>
                </tr>
              </thead>
              <tbody>
                {_.map(fields, CollectionFieldFormItemWrapper({ data, collection, name }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

// 表 form

class CollectionFormItem extends Component {
  debouncedOnChange = _.debounce(evt => {
    const { data, collection, name } = this.props
    let value = evt.target.value
    if (evt.target.type === 'checkbox') value = evt.target.checked
    app.axios.post('/settings/update', {
      targetCollection: collection.name,
      name: evt.target.name,
      value,
    })
  }, 100)

  onChange = evt => {
    evt.persist()
    this.debouncedOnChange(evt)
  }

  changeName = evt => {
    this.onChange(evt)
    this.props.changeName(evt.target.value)
  }

  render() {
    const { data, collection } = this.props
    const prefixPath = `settings.${collection.name}`
    return (
      <tr>
        <td className='pd-sm'>{collection.name}</td>
        <td className='pd-sm'>
          <CInput name='label' value={_.get(data, `${prefixPath}.label`)} onInputChange={this.changeName} />
        </td>
        <td className='pd-sm'>
          <textarea name='desc' rows='1' defaultValue={_.get(data, `${prefixPath}.desc`)} onChange={this.onChange}></textarea>
        </td>
        <td className='pd-sm'>
          <input type='checkbox' name='isDisabled' defaultChecked={_.get(data, `${prefixPath}.isDisabled`)} onChange={this.onChange} />
        </td>
        <td className='pd-sm'>
          <input type='checkbox' name='isWorkingSet' defaultChecked={_.get(data, `${prefixPath}.isWorkingSet`)} onChange={this.onChange} />
        </td>
        <td className='pd-sm'>
          <input type='number' name='limit' defaultValue={_.get(data, `${prefixPath}.limit`)} onChange={this.onChange} />
        </td>
      </tr>
    )
  }
}

class CollectionFieldFormItem extends Component {
  state = {
    datatype: _.get(this.props.data, `settings.${this.props.collection.name}.fields.${this.props.name}.datatype`)
  }

  debouncedOnChange = _.debounce(evt => {
    const { data, collection, name } = this.props
    let value = evt.target.value
    if (evt.target.type === 'checkbox') value = evt.target.checked
    app.axios.post('/settings/update', {
      targetCollection: collection.name,
      targetField: name,
      name: evt.target.name,
      value,
    })
  }, 100)

  onChange = evt => {
    evt.persist()
    this.debouncedOnChange(evt)
  }

  onChangeDataType = evt => {
    this.onChange(evt)
    this.setState({ datatype: evt.target.value })
  }

  componentDidMount() {}

  render() {
    const { data, collection, name } = this.props
    const prefixPath = `settings.${collection.name}.fields.${name}`
    return (
      <tr>
        <td className='pd-sm'>{name}</td>
        <td className='pd-sm'>
          <CInput name='label' value={_.get(data, `${prefixPath}.label`)} onInputChange={this.onChange} />
        </td>
        <td className='pd-sm'>
          <select name='datatype' defaultValue={_.get(data, `${prefixPath}.datatype`)} onChange={this.onChangeDataType}>
            <option />
            <option value='string'>String</option>
            <option value='number'>Number</option>
            <option value='boolean'>Boolean</option>
            <option value='array'>Array</option>
            <option value='object'>Objcet</option>
            <option value='date'>Date</option>
            <option value='mix'>Mix</option>
          </select>
          {this.state.datatype &&
            <input type='text' name='formatter'
              defaultValue={_.get(data, `${prefixPath}.formatter`)}
              onChange={this.onChange}
            />
          }
        </td>
        <td className='pd-sm'>
          <PrimaryKeySelector
            data={data}
            collection={collection}
            name={name}
            primaryCollection={_.get(data, `${prefixPath}.primaryCollection`)}
            primaryField={_.get(data, `${prefixPath}.primaryField`)}
            displayField={_.get(data, `${prefixPath}.displayField`)}
            onChange={this.onChange}
          />
        </td>
        <td className='pd-sm'>
          <input type='checkbox' name='isDisabled' defaultChecked={_.get(data, `${prefixPath}.isDisabled`)} onChange={this.onChange} />
        </td>
        <td className='pd-sm'>
          <input type='checkbox' name='isUnImportant' defaultChecked={_.get(data, `${prefixPath}.isUnImportant`)} onChange={this.onChange} />
        </td>
      </tr>
    )
  }
}

const CollectionFormGroupWrapper = data => collection => <CollectionFormGroup key={collection.name} data={data} collection={collection} />
const CollectionFormItemWrapper = ({ data, collection, changeName }) => <CollectionFormItem data={data} collection={collection} changeName={changeName} />
const CollectionFieldFormItemWrapper = ({ data, collection, name }) => (value, key) => <CollectionFieldFormItem key={key} data={data} collection={collection} name={value} />

export default class extends Component {
  state = {
    loading: true,
    data: undefined,
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { data } = await app.axios.get(process.env.ROOT_URL ? `${process.env.ROOT_URL}/api/v1/core` : 'http://localhost:3000/api/v1/core')

    this.setState({
      loading: false,
      data,
    }, () => {
      this.jumpToHash()
    })
  }

  jumpToHash = () => {
    const { hash } = app.route.location
    if (!hash) return
    document.querySelector(hash).scrollIntoView({} || { block: 'start',  behavior: 'smooth' })
  }

  render() {
    if (this.state.loading) return <div>loading</div>

    const { data } = this.state

    return (
      <div className='flex-row'>
        <div className='flex-1x'>
          <div style={{ position: 'fixed' }}>
            <div>
              <Link to='/settings/views'>views</Link>
            </div>
            <div>
              <Link to='/settings/boards'>boards</Link>
            </div>
            <div className='mgb'></div>
            {_.map(data.overview.collections, (collection, key) => (
              <div key={key}>
                <a href={`#${collection.name}`}>
                  {collection.name}
                </a>
              </div>
            ))}
            <div className='mgb'></div>
            <div>
              <Link to='/dashboard'>dashboard</Link>
            </div>
          </div>
        </div>
        <div className='flex-11x'>{_.map(data.overview.collections, CollectionFormGroupWrapper(data))}</div>
      </div>
    )
  }
}
