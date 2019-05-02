const bcrypt = require('bcryptjs')

const Users = db.collection('users')

module.exports = function ({ router }) {

  return router

    .post('/register', async function (req, res, next) {
      const { username, password } = req.body

      if (!username || !password)
        return next('username and password required')

      const isUserExist = await Users.findOne({ username })

      if (isUserExist)
        return next('username already exists')

      const token = nanoid()

      const currentUser = {
        username,
        createdAt: new Date(),
        services: {
          hash: hashSync(password),
          tokens: [{
            token,
            expiredAt: moment(new Date()).add(process.env.EXPIRED_IN_DAYS || 15, 'd').startOf('day').toDate(),
          }]
        }
      }

      await Users.insertOne(currentUser)

      const result = {
        token,
        currentUser: _.omit(currentUser, 'services'),
      }

      return res.json({ result })
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

      const result = {
        token,
        currentUser
      }

      return res.json({ result })
    })

    .post('/token', async function (req, res, next) {
      const { token } = req.body

      if (!token)
        return next('token required')

      const isTokenExist = await Users.findOne({ 'services.tokens.token': token })

      if (!isTokenExist)
        return next('token doesn\'t exist')

      const isTokenExpired = _.chain(isTokenExist)
        .get('services.tokens')
        .find({ token })
        .value()

      const expired = moment(isTokenExpired.expiredAt).diff(new Date(), 'days')

      if (expired <= 0) {
        await Users.findOneAndUpdate({ 'services.tokens.token': token }, {
          $pull: { 'services.tokens': { token } }
        })

        return next('token has expired')
      }

      const currentUser = _.omit(isTokenExist, 'services')

      const result = {
        token,
        currentUser
      }

      return res.json({ result })
    })

    .post('/password', async function (req, res, next) {
      const { password, newPassword } = req.body

      if (!password || !newPassword)
        return next('password and newPassword required')

      console.log(this.currentUser)

      if (!this.currentUser)
        return next('failed to change password')

      const { _id } = this.currentUser

      console.log(_id)

      const isUserExist = await Users.findOne({ _id })

      if (!isUserExist)
        return next('username doesn\'t exist')

      const _hash = _.get(isUserExist, 'services.hash')

      const isSamePassword = await bcrypt.compare(password, _hash)

      if (!isSamePassword)
        return next('wrong password')

      const hash = hashSync(newPassword)

      await Users.findOneAndUpdate({ _id: isUserExist._id }, {
        $set: {
          'services.tokens': [],
          'services.hash': hash,
        }
      })

      return res.sendStatus(200)
    })

}


function hashSync(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
