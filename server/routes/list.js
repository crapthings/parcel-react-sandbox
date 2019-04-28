module.exports = function ({ router }) {

  return router

    .get('/list', function (req, res) {
      console.log('req')

      const list = _.times(100, n => ({
        _id: nanoid(),
        title: faker.lorem.sentence(),
        desc: faker.lorem.paragraph(),
      }))

      return res.json(list)
    })

}
