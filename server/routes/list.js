module.exports = function ({ router }) {

  return router

    .get('/list', function (req, res) {
      const list = _.times(100, n => ({
        _id: nanoid(),
        title: faker.lorem.sentence(),
        desc: faker.lorem.paragraph(),
      }))

      const result = { list }

      return res.json({ result })
    })

}
