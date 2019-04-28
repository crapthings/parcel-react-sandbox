const bcrypt = require('bcryptjs')

const fakeLogins = _.keyBy([
  {
    username: 'admin',
    hash: bcrypt.hashSync('admin', bcrypt.genSaltSync(10))
  },

  {
    username: 'test',
    hash: bcrypt.hashSync('test', bcrypt.genSaltSync(10))
  },

  {
    username: 'demo',
    hash: bcrypt.hashSync('demo', bcrypt.genSaltSync(10))
  },

  {
    username: '123',
    hash: bcrypt.hashSync('123', bcrypt.genSaltSync(10))
  },
], 'username')

const tokens = {
  test: fakeLogins['admin']
}

module.exports = function ({ router }) {

  return router

    .post('/token', function (req, res, next) {
      const { token } = req.headers
      const currentUser = _.chain(tokens).get(token, {}).omit(['hash']).value()
      return res.json({ currentUser })
    })

    .post('/login', async function (req, res, next) {
      const { username, password } = req.body

      const hash = _.get(fakeLogins, `${username}.hash`)
      const checkPassword = await bcrypt.compare(password, hash)

      if (!checkPassword)
        next('login failed')

      const token = nanoid()

      const currentUser = tokens[token] = _.chain(fakeLogins)
        .get(username)
        .omit(['hash'])
        .value()

      return res.json({ token, currentUser })
    })

}
