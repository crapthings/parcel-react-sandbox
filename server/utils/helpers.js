const check = schema => function (req, res, next) {
  if (schema.body) {
    joi.validate(req.body, schema.body, function (err, result) {
      if (err) return next(err.details[0].message)
    })
  }

  next()
}

module.exports = {
  check,
}
