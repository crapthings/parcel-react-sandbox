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

const PORT = process.env.PORT || 3000

const server = express()
const router = express.Router()

server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(express.static('public'))

const routes = fs.readdirSync('./routes')

_.each(routes, route => {
  server.use('/api', require(`./routes/${route}`)({ router }))
})

server.use(function(err, req, res, next) {
  if (req.url == '/api/logs') return next()
  if (!err) return next()
  res.status(500).json({ err })
})

server.listen(PORT, () => {
  console.log(`server is running at ${PORT}`)
})
