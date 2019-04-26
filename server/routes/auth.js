const bcrypt = require('bcryptjs')

const tokens = {}

const fakeLogins = _.keyBy([
  {
    username: 'admin',
    hash: bcrypt.hashSync('admin', bcrypt.genSaltSync(10))
  },

  {
    username: 'test',
    hash: bcrypt.hashSync('test', bcrypt.genSaltSync(10))
  },
], 'username')

module.exports = function ({ router }) {

  return router

    .post('/login', async function (req, res, next) {
      console.log(tokens)

      const { token } = req.headers

      if (tokens[token]) {
        return res.json({ token, user: tokens[token] })
      }

      const { username, password } = req.body
      const hash = _.get(fakeLogins, `${username}.hash`)
      const checkPassword = await bcrypt.compare(password, hash)

      if (!checkPassword)
        next('login failed')

      const _token = nanoid()

      const user = tokens[_token] = _.chain(fakeLogins)
        .get(username)
        .omit(['hash'])
        .value()

      return res.json({ token: _token, user })
    })

}
