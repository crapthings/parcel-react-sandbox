module.exports = (...args) => (req, res, next) => {
  if (/^\/api/.test(req.url) || /^\/private/.test(req.url)) {
    return next()
  }

  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html')) {
    (res.sendFile || res.sendfile).call(res, ...args, err => err && next())
  } else next()
}
