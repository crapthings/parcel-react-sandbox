module.exports = function ({ router }) {

  return router

    .post('/logs', function (req, res) {
      _.each(req.body, item => {
        console.log(item, '\n')
      })

      _.each(req.headers, item => {
        console.log(item, '\n')
      })
      return res.sendStatus(200)
    })

}
