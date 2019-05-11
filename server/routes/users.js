const bcrypt = require('bcryptjs')

const Users = db.collection('users')

module.exports = function ({ router }) {

  return router

    .get('/users', async function (req, res) {
      const results = await db.users.fetch({}, {
        projection: { services: false },
      })

      return res.json(results)
    })

    .post('/register', check({
      body: {
        username: joi.string().required(),
        password: joi.string().required(),
      }
    }), async function (req, res, next) {
      const { username, password } = req.body

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

    .post('/login', check({
      body: {
        username: joi.string().required(),
        password: joi.string().required(),
      }
    }), async function (req, res, next) {
      const { username, password } = req.body

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

    .post('/token', check({
      body: {
        token: joi.string().required(),
      }
    }), async function (req, res, next) {
      const { token } = req.body

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

    .post('/password', check({
      body: {
        password: joi.string().required(),
        newPassword: joi.string().required(),
      }
    }), async function (req, res, next) {
      const { password, newPassword } = req.body

      if (!this.currentUser)
        return next('failed to change password')

      const { _id } = this.currentUser

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
