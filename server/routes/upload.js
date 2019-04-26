const multer  = require('multer')
const upload = multer({ dest: 'public/' })

module.exports = function ({ router }) {

  return router

    .post('/upload', upload.array('file'), function (req, res) {
      return res.json(req.files)
    })

}
