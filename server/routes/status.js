module.exports = function ({ router }) {

  return router

    .get('/status', async function (req, res, next) {
      return res.sendStatus(200)
    })

}
