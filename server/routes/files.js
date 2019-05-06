const multer  = require('multer')
const upload = multer({ dest: 'private/' })

const Users = db.collection('users')
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

    .post('/avatar', upload.single('file'), async function (req, res, next) {
      if (_.isEmpty(req.file)) return next('no avatar')
      const { _id } = this.currentUser
      const { filename: avatar } = req.file
      const { value: currentUser } = await Users.findOneAndUpdate({ _id }, { $set: { avatar } })
      return res.json({ result: { currentUser: _.omit(currentUser, 'services') } })
    })

}
