module.exports = function ({ router }) {

  return router

    .get('/status', function (req, res) {
      return res.sendStatus(200)
    })

}
