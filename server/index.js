require('dotenv').config()

const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

_ = require('lodash')
moment = require('moment')
nanoid = require('nanoid')
faker = require('faker')
axios = require('axios')
joi = require('@hapi/joi')

db = null
check = require('./utils/helpers').check

const PORT = process.env.PORT || 3000

const server = express()
const router = express.Router()
const routes = fs.readdirSync(path.resolve(__dirname, 'routes'))

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

boot()

async function boot() {
  db = await require('./db')()

  // auth hook
  server.use(require('./hooks/auth'))

  // mount each router
  _.each(routes, route => {
    const __module__ = path.resolve(__dirname, 'routes', route)
    server.use('/api', require(__module__)({ router }))
  })

  if (process.env.NODE_ENV !== 'production') {
    const root = '../client/dist'
    const index = 'index.html'
    server.use('/', express.static(root, { index }))
    server.use(require('./utils/dev.route.fallback')(index, { root }))
  }

  server.use('/private', express.static('private'))

  // error hook
  server.use(require('./hooks/error'))

  server.listen(PORT, async () => {
    console.log(`server is running at ${PORT}`)
  })
}
