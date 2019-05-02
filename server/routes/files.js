const multer  = require('multer')
const upload = multer({ dest: 'public/' })

const Files = db.collection('files')

module.exports = function ({ router }) {

  return router

    .get('/files', async function (req, res, next) {
      const files = await Files.find({}).toArray()
      const result = { files }
      return res.json({ result })
    })

    .post('/upload', upload.array('file'), async function (req, res) {
      if (_.isEmpty(req.files)) return next('no files')
      const { ops: files } = await Files.insertMany(req.files)
      const result = { files }
      return res.json({ result })
    })

}
