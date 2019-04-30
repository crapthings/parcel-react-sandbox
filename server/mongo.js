module.exports = function (db) {
  db.collection('users').createIndex({ username: 1 }, { unique: true })
  db.collection('users').createIndex({ 'services.tokens.token': 1 })
}
