module.exports = function ({ router }) {

  return router

    .post('/logs', function (req, res) {
      const { headers: header, body: app } = req

      db.collection('__logs').insertOne({ header, app })

      return res.sendStatus(200)
    })

}
