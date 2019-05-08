const Users = db.collection('users')

module.exports = async function (req, res, next) {
  if (!/^\/api/.test(req.url) || _.includes([
    '/api/status',
    '/api/register',
    '/api/login',
    '/api/token',
    '/api/logs',
  ], req.url)) {
    return next()
  }

  const { token } = req.headers

  const isTokenExist = await Users.findOne({ 'services.tokens.token': token })

  if (!isTokenExist)
    return next('require login')

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

  this.currentUser = _.omit(isTokenExist, 'services')

  return next()
}
