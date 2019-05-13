module.exports = function ({ router }) {

  return router

    .get('/lists', async function (req, res, next) {
      const page = _.round(req.query.page)
      const skip = (page == NaN || page == 0 || page == 1) ? 0 : page
      const results = await db.lists.fetch({}, { skip })
      return res.json(results)
    })

}
