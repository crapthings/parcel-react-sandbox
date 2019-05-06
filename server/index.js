require('dotenv').config()

const fs = require('fs')
const path = require('path')

const MongoClient = require('mongodb').MongoClient

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

_ = require('lodash')
moment = require('moment')
nanoid = require('nanoid')
faker = require('faker')
axios = require('axios')

db = null

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/__test__'
const PORT = process.env.PORT || 3000

const server = express()
const router = express.Router()

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

const routes = fs.readdirSync(path.resolve(__dirname, 'routes'))

boot()

async function boot() {

  const mongo = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
  })

  db = mongo.db()

  // build mongo index
  require('./mongo')(db)

  // auth hook
  server.use(require('./hooks/auth')({ db }))

  // mount each router
  _.each(routes, route => {
    const __module__ = path.resolve(__dirname, 'routes', route)
    server.use('/api', require(__module__)({ router }))
  })

  if (process.env.NODE_ENV !== 'production') {
    const root = '../dist'
    const index = 'index.html'
    server.use('/', express.static(root, { index }))
    server.use(require('./dev/fallback')(index, { root }))
  }

  server.use('/private', express.static('private'))

  // error hook
  server.use(require('./hooks/error'))

  server.listen(PORT, async () => {
    console.log(`server is running at ${PORT}`)
  })

}
