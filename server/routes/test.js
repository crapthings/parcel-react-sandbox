const fs = require('fs')
const path = require('path')
const prettyBytes = require('pretty-bytes')
const parser = require('../utils/parser')

const OPS = {
  first: arg => ({ stash, result }) => {
    return _.first(result)
  },
  mapKeys: arg => ({ stash, result }) => {
    if (/^@/.test(arg)) {
      result = _.mapKeys(result, (value, key) => {
        // return _.get(stash, `${arg.slice(1)}.${key}`, key)
        return stash[arg.slice(1)][key] || key
      })
      return result
    }
  },
  max: arg => ({ stash, result }) => {
    if (!arg) {
      if (_.isPlainObject(result)) {
        result = _.chain(result).toPairs().max().value()
        return result
      }
    }

    return _.max(result)
  },
  toPairs: arg => ({ stash, result }) => {
    return _.toPairs(result)
  },
  size: arg => ({ stash, result }) => {
    return _.size(result)
  },
  pickBy: arg => async ({ stash, result }) => {
    const keys = ['_id', ...arg.split(',')]

    return _.isPlainObject(result)
      ? _.pick(result, keys)
      : _.chain(result).map(item => _.pick(item, keys)).value()
  },
  keyBy: arg => ({ stash, result }) => {
    return _.keyBy(result, arg)
  },
  countBy: arg => ({ stash, result }) => {
    return _.countBy(result, (v, k) => {
      if (_.get(v, arg) === null)
        return undefined

      return _.get(v, arg)
    })
  },
  groupBy: arg => ({ stash, result }) => {
    return _.groupBy(result, arg)
  },
  map: arg => ({ stash, result }) => {
    if (!arg) {
      return _.map(result, (v) => v)
    }
    const t = arg.replace(/\s/g, '')
      .split(',')
      .map(line => {
        let [field, value] = line.split('=')
        value = value.split('||').map(item => {
          if (item.startsWith('@')) {
            item = item
              .replace(/@/, '')
              .replace(/^/, 'moment(`${item["' + field + '"]}`).format("')
              .replace(/$/, '")')
          } else {
            item = item
              .replace(/\./, '.${item[' + '"' + field + '"' + ']}.')
              .replace(/^/, '`').replace(/$/, '`')
              .replace(/^/, '_.get(stash, ').replace(/$/, ')')
          }
          return item
        }).join('||')
        return 'item.' + field + '=' + value
      })
      .join('\n')

    const mapFn = item => {
      eval(t)
      return item
    }

    return result.map(mapFn)
  }
}

// 忽略掉一些无意义的表
const getIgnoreCollectionNames = () => {
  const ignoreString = fs.readFileSync(path.resolve(process.cwd(), '.collectionignore'), 'utf8')
  if (ignoreString) return _.chain(ignoreString).split('\n').reject(_.isEmpty).value()
  return []
}

// 把对象的字段名拼装成路径
const getFields = ({ doc, fields = {}, prefix, tester }) => {
  for (const key in doc) {
    if (tester && tester(key)) continue
    const value = doc[key]
    if (_.isPlainObject(value)) {
      const _prefix = prefix ? prefix + '.' + key : key
      getFields({ doc: value, fields, prefix: _prefix })
    } else {
      const _prefix = prefix ? prefix + '.' + key : key
      fields[_prefix] = _prefix
    }
  }
  return fields
}

// 定制忽略的字段
const wrapGetFields = doc => getFields({ doc, tester: function (key) {
  if (/^attachmentsInfo/.test(key)) return true
  return false
} })

// 把已知的字段合并
const mergeFields = (doc, accumulator = {}) => {
  return accumulator = { ...accumulator, ...doc }
}

module.exports = function ({ router }) {

  return router

    .get('/init', async function (req, res) {
      const collections = _.chain(await db.listCollections().toArray())
        .map(({ name }) => ({ name }))
        .reject(({ name }) => _.includes(getIgnoreCollectionNames(), name))
        .keyBy('name')
        .value()

      for (const collection in collections) {
        const docs = await db.collection(collection).find({}, { sort: { $natural: -1 }, limit: 50000 }).toArray()
        const fields = _.chain(docs)
          .map(wrapGetFields)
          .reduce(mergeFields)
          .value()
        _.set(collections, `${collection}.fields`, fields)
      }

      const overview = { name: 'overview' }
      const updatedAt = new Date()
      const result = { ...overview, updatedAt, collections }
      const ops = [overview, { $set: result }, { upsert: true, returnNewDocument: true }]
      await cachedb.collection('core').findOneAndUpdate(...ops)
      await cachedb.collection('core').findOneAndUpdate({ name: 'settings' }, { $set: { name: 'settings' } }, { upsert: true })
      res.json(result)
    })

    .get('/core', async function (req, res, next) {
      const overview = await cachedb.collection('core').findOne({ name: 'overview' })
      const settings = await cachedb.collection('core').findOne({ name: 'settings' })
      const counts = { ...overview.collections }
      const storageSize = { ...overview.collections }

      for (collectionName in overview.collections) {
        const count = await db.collection(collectionName).countDocuments()
        const stats = await db.collection(collectionName).stats()
        counts[collectionName] = count
        storageSize[collectionName] = prettyBytes(stats.storageSize)
      }

      res.json({
        overview,
        settings,
        counts,
        storageSize,
      })
    })

    .post('/settings/update', async function (req, res, next) {
      const { targetCollection, targetField, name, value } = req.body
      let operator = '$set'
      if (!value) operator = '$unset'
      if (_.isBoolean(value)) operator = '$set'
      let operatorPath = `${targetCollection}.fields.${targetField}.${name}`
      if (!targetField) operatorPath = `${targetCollection}.${name}`
      const ops = [{ name: 'settings' }, { [operator]: { [operatorPath]: value } }, { upsert: true, returnNewDocument: true }]
      await cachedb.collection('core').findOneAndUpdate(...ops)
      res.sendStatus(200)
    })

    .get('/settings/boards', async function (req, res) {
      const boards = await cachedb.collection('boards').find().toArray()
      res.json(boards)
    })

    .post('/settings/boards', async function (req, res) {
      try {
        const doc = req.body
        delete doc._id
        await cachedb.collection('boards').insertOne(doc)
        res.sendStatus(200)
      } catch (ex) {
        console.log(ex)
      }
    })

    .put('/settings/boards', async function (req, res) {
      console.log(req.body)
      try {
        const _id = ObjectId(req.body._id)
        const doc = req.body
        delete doc._id
        await cachedb.collection('boards').updateOne({ _id }, { $set: doc })
        res.sendStatus(200)
      } catch (ex) {
        console.log(ex)
      }
    })

    .delete('/settings/boards', async function (req, res) {
      await cachedb.collection('boards').deleteOne({ _id: ObjectId(req.body._id) })
      res.sendStatus(200)
    })

    .get('/settings/views', async function (req, res) {
      const views = await cachedb.collection('views').find().toArray()
      res.json(views)
    })

    // .get('/views/:_id', async function (req, res) {
    //   const _id = ObjectId(req.params._id)
    //   const view = await cachedb.collection('views').findOne({ _id })
    //   view.name = _.first(view.script.split('\n'))
    //   res.json(view)
    // })

    .post('/settings/views', async function (req, res) {
      try {
        const doc = req.body
        delete doc._id
        await cachedb.collection('views').insertOne(doc)
        res.sendStatus(200)
      } catch (ex) {
        console.log(ex)
      }
    })

    .put('/settings/views', async function (req, res) {
      try {
        const _id = ObjectId(req.body._id)
        const doc = req.body
        delete doc._id
        await cachedb.collection('views').updateOne({ _id }, { $set: doc })
        res.sendStatus(200)
      } catch (ex) {
        console.log(ex)
      }
    })

    .delete('/settings/views', async function (req, res) {
      await cachedb.collection('views').deleteOne({ _id: ObjectId(req.body._id) })
      res.sendStatus(200)
    })

    .get('/statistics/:collectionName', async function (req, res) {
      const { data: { overview, settings } } = await axios.get('http://localhost:3000/api/v1/core')
      const { collectionName } = req.params
      const { startRow, endRow } = req.query

      const getOptions = _.get(settings, `${collectionName}`)
      const getFieldsOptions = _.get(settings, `${collectionName}.fields`)

      // move later
      const count = await db.collection(collectionName).countDocuments()

      const metadata = {
        count,
      }

      const $projection = _.chain(getFieldsOptions)
        .index()
        .pickBy((value, key) => key.includes('isUnImportant') && value)
        .mapValues(_.constant(0))
        .mapKeys((value, key) => _.chain(key).split('.').dropRight().join('.').value())
        .value()

      const query = {}
      const opts = {}

      if (startRow) {
        opts.skip = parseInt(startRow)
      }

      if (getOptions.limit) {
        opts.limit = parseInt(getOptions.limit)
      }

      const ops = [query, opts]
      const docs = await db.collection(collectionName)
        .find(...ops)
        .project($projection)
        .toArray()

      const refDocs = {}

      const _test1 = _.chain(getFieldsOptions)
        .map((value, fieldName) => ({ fieldName, ...value }))
        .value()

      for (test of _test1) {
        let foundRefDoc = false
        for (key in test) {
          if (key.includes('primaryCollection') === false) continue
          foundRefDoc = true
          break
        }
        if (foundRefDoc === false) continue
        const { fieldName, primaryCollection, primaryField, displayField } = test
        const ids = _.map(docs, fieldName)
        const _docs = await db.collection(primaryCollection)
          .find({ [primaryField]: { $in: ids } })
          .toArray()

        _.set(refDocs, primaryCollection, _.keyBy(_docs, primaryField))
      }

      res.json({
        overview,
        settings,
        docs,
        refDocs,
        metadata,
      })
    })

    .get('/views/:_id', async function (req, res) {
       const view = await cachedb.collection('views').findOne({ _id: ObjectId(req.params._id) })

       let stash = {}
       const result = { dict: {}, pivot: {} }

       let setTitle = false

       for (line of view.script.split('\n')) {
         if (_.chain(line).trim().isEmpty().value()) continue

         if (!setTitle) {
           result.title = line
           setTitle = true
           continue
         }

         let _result

         if (line.startsWith('$$')) {
           const ops = parser(line)
           // console.log(ops)
           // const ops = line.split(/\s+(?![^\[]*\]|[^(]*\)|[^\{]*})/)
           let collectionName, mongoMethod
           let query = {}
           const options = {}

           for (const { method, arg } of ops) {
             // const [, method, arg] = op.match(/([\W\w]+)\(([^)]+)?\)/)

             if (method === 'count') {
               mongoMethod = method
               query = arg ? JSON5.parse(arg) : {}
               continue
             }

             if (method === '$$') {
               collectionName = arg
             }

             if (method === 'limit') {
               options.limit = parseInt(arg)
             }

             if (method === 'sort') {
               options.sort = JSON5.parse(arg)
             }

             if (method === 'query' || method === 'filter') {
               query = JSON5.parse(arg, function (k, v) {
                 if (/^\^/.test(v)) v = eval(v.slice(1))
                 return v
               })
               continue
             }

             if (method === 'pickBy') {
               const projection = {}
               const args = _.chain(arg).split(',').map(_.trim).value().forEach(arg => {
                 projection[arg] = true
               })
               options.projection = projection
               continue
             }

             if (method === 'as') {
               if (mongoMethod === 'count') {
                 stash[arg] = await db.collection(collectionName).countDocuments(query, options)
                 continue
               }

               stash[arg] = await db.collection(collectionName).find(query, options).toArray()
               continue
             }
           }
         } else if (line.startsWith('chart')) {
           const ops = line.split(/\s+(?![^\[]*\]|[^(]*\)|[^\{]*})/)
           for (const op of ops) {
             const [, method, arg] = op.match(/([\W\w]+)\(([^)]+)?\)/)

             if (method === 'chart') {
               result.chartType = arg
             }
           }
         } else if (line.startsWith('pivot')) {
           const [, _line] = line.split('pivot ')
           const ops = _line.split(/\s+(?![^\[]*\]|[^(]*\)|[^\{]*})/)

           for (const op of ops) {
             const [, method, arg] = op.match(/([\W\w]+)\(([^)]+)?\)/)

             if (method === 'rows') {
               result.pivot.rows = arg.replace(/\s/g, '').split(',')
             }

             if (method === 'cols') {
               result.pivot.cols = arg.replace(/\s/g, '').split(',')
             }
           }
         } else if (line.startsWith('stash')) {
           const ops = parser(line)

           for (const { method, arg } of ops) {
             stash = { ...stash, ...JSON.parse(arg) }
           }
         } else {
           for (op of line.split(/\s+(?![^\[]*\]|[^(]*\)|[^\{]*})/)) {
             const [, method, arg] = op.match(/([\W\w]+)\(([^)]+)?\)/)

             if (method === 'ref' || method === 'use') {
               _result = stash[arg]
               continue
             }

             if (method === 'output') {
               result.data = stash[arg]
               result.collectionName = arg
               res.json(result)
               break
             }

             if (method === 'as') {
               stash[arg] = _result
               continue
             }

             if (method === 'dict') {
               const _arg = _.chain(arg).split(',').map(_.trim).value()
                 .forEach(arg => {
                   _.set(result, `dict.${arg}`, stash[arg])
                 })
               continue
             }

             if (OPS[method](arg) instanceof Promise) {
               _result = await OPS[method](arg)({ stash, result: _result })
             } else {
               _result = OPS[method](arg)({ stash, result: _result })
             }
           }
         }
       }
    })

    .get('/boards/:_id', async function (req, res) {
      const { _id } = req.params
      const result = await cachedb.collection('boards').findOne({ _id: ObjectId(_id) })
      res.json(result)
    })

}
