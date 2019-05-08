module.exports = function (db) {

  db.users.createIndexes([

    {
      key: { username: 1 },
      unique: true,
    },

    {
      key: { 'services.tokens.token': 1 },
    }

  ])

}
