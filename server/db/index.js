const MongoClient = require('mongodb').MongoClient
const createIndexes = require('./indexes')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/__test__'

module.exports = async function () {
  const mongo = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
  })

  const db = mongo.db()

  db.users = db.collection('users')
  db.files = db.collection('files')

  createIndexes(db)

  return db
}
