const { Collection, MongoClient } = require('mongodb')
const createIndexes = require('./indexes')
const helpers = require('./helpers')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/dezhi'
const MONGO_URL_CUBE_DASHBOARD = process.env.MONGO_URL_CUBE_DASHBOARD || 'mongodb://localhost:27017/cube_dashboard'

module.exports = async function () {
  // helpers(Collection)

  const mongo = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
  })

  const mongoalt = await MongoClient.connect(MONGO_URL_CUBE_DASHBOARD, {
    useNewUrlParser: true,
  })

  const db = mongo.db()
  const cachedb = mongoalt.db()

  db.groups = db.collection('groups')
  db.users = db.collection('users')
  db.issues = db.collection('issues')
  db.activities = db.collection('activities')
  db.issuemembers = db.collection('issuemembers')

  // createIndexes(db)

  return { db, cachedb }
}
