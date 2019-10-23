require('dotenv').config()

const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const pino = require('express-pino-logger')()
// const { Deepstream } = require('@deepstream/server')

_ = require('lodash')
require('deepdash')(_)
sugar = require('sugar')
moment = require('moment')
nanoid = require('nanoid')
faker = require('faker')
axios = require('axios')
joi = require('@hapi/joi')
JSON5 = require('json5')
XRegExp = require('xregexp')

ObjectId = require('mongodb').ObjectId
db = null
cachedb = null
_routes = null
check = require('./utils/helpers').check

sugar.extend()

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i)
}

const PORT = process.env.PORT || 3000

const server = express()
const router = express.Router()
const routes = fs.readdirSync(path.resolve(__dirname, 'routes'))

// server.use(pino)
server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

// dsserver = new Deepstream()
// dsserver.start()

boot()

async function boot() {
  const database = await require('./db')()

  db = database.db
  cachedb = database.cachedb

  // require('./db/init')

  // auth hook
  // server.use(require('./hooks/auth'))

  // mount each router
  _.each(routes, route => {
    const __module__ = path.resolve(__dirname, 'routes', route)
    server.use('/api/v1', require(__module__)({ router }))
  })

  if (process.env.NODE_ENV !== 'production') {
    const root = './static'
    const index = 'index.html'
    server.use('/', express.static(root, { index }))
    server.use(require('./utils/dev.route.fallback')(index, { root }))
  }

  server.use('/private', express.static('private'))

  // error hook
  server.use(require('./hooks/error'))

  _routes = _.map(router.stack, 'route.path')

  server.listen(PORT, async () => {
    console.log(`server is running at ${PORT}`)
  })
}
