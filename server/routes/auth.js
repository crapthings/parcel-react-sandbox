const bcrypt = require('bcryptjs')

const Users = db.collection('users')

module.exports = function ({ router }) {

  return router

    .post('/register', async function (req, res, next) {
      const { username, password } = req.body

      if (!username || !password)
        return next('missing username or password')

      const isUserExist = await Users.findOne({ username })

      if (isUserExist)
        return next('username exist')

      const user = {
        username,
        createdAt: new Date(),
        services: {
          hash: hashSync(password),
          tokens: [{
            token: nanoid(),
            expiredAt: moment(new Date()).add(process.env.EXPIRED_IN_DAYS || 15, 'd').startOf('day').toDate(),
          }]
        }
      }

      const result = await Users.insertOne(user)

      return res.json(result)
    })

    .post('/login', async function (req, res, next) {
      const { username, password } = req.body

      if (!username || !password)
        return next('require username and password')

      const isUserExist = await Users.findOne({ username })

      if (!isUserExist)
        return next('username doesn\'t exist')

      const _hash = _.get(isUserExist, 'services.hash')

      const isSamePassword = await bcrypt.compare(password, _hash)

      if (!isSamePassword)
        return next('wrong password')

      const currentUser = _.omit(isUserExist, 'services')

      const token = nanoid()
      const expiredAt = moment(new Date()).add(process.env.EXPIRED_IN_DAYS || 15, 'd').startOf('day').toDate()

      await Users.findOneAndUpdate({ _id: isUserExist._id }, {
        $push: { 'services.tokens': { token, expiredAt } }
      })

      return res.json({ token, currentUser })
    })

    .post('/password', async function (req, res, next) {
      const { username, password, newPassword } = req.body

      if (!username || !password || !newPassword)
        return next('require username, password and newPassword')

      const isUserExist = await Users.findOne({ username })

      if (!isUserExist)
        return next('username doesn\'t exist')

      const _hash = _.get(isUserExist, 'services.hash')

      const isSamePassword = await bcrypt.compare(password, _hash)

      if (!isSamePassword)
        return next('wrong password')

      const hash = hashSync(newPassword)

      const result = await Users.findOneAndUpdate({ _id: isUserExist._id }, {
        $set: {
          'services.tokens': [],
          'services.hash': hash,
        }
      })

      return res.json(result)
    })

    .post('/token', async function (req, res, next) {
      const { token } = req.body

      if (!token)
        return next('require token')

      const isTokenExist = await Users.findOne({ 'services.tokens.token': token })

      if (!isTokenExist)
        return next('token not found')

      const isTokenExpired = _.chain(isTokenExist)
        .get('services.tokens')
        .find({ token })
        .value()

      const expired = moment(isTokenExpired.expiredAt).diff(new Date(), 'days')

      if (expired <= 0) {
        await Users.findOneAndUpdate({ 'services.tokens.token': token }, {
          $pull: { 'services.tokens': { token } }
        })

        return next('login expired')
      }

      const currentUser = _.omit(isTokenExist, 'services')

      return res.json({ token, currentUser })
    })

}


function hashSync(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
