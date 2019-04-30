module.exports = function ({ router }) {

  return router

    .post('/logs', function (req, res) {
      db.collection('__logs').insertOne({
        header: req.headers,
        app: req.body,
      })
      return res.sendStatus(200)
    })

}
