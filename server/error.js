module.exports = async (err, req, res, next) => {
  try {
    if (err) return res.json({ err })
    return next()
  } catch (ex) {
    return res.status(500)
  }
}
