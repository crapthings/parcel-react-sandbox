module.exports = async (err, req, res, next) => {
  try {
    if (err) {
      console.log(err)
      return res.json({ err })
    }
    return next()
  } catch (ex) {
    console.log(ex)
    return res.status(500)
  }
}
