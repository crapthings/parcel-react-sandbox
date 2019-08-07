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

    .post('/files', upload.array('file'), async function (req, res, next) {
      if (_.isEmpty(req.files)) return next('no files')
      const { ops: files } = await Files.insertMany(req.files)
      const result = { files }
      return res.json({ result })
    })

    .delete('/files', async function (req, res) {
      console.log(req.body)
      const _id = ObjectId(req.body._id)
      const op = await Files.removeOne({ _id })
      console.log(op)
      return res.json()
    })

    .post('/avatar', upload.single('file'), async function (req, res, next) {
      if (_.isEmpty(req.file)) return next('no avatar')
      const { _id } = this.currentUser
      const { filename: avatar } = req.file
      const { value: currentUser } = await Users.findOneAndUpdate({ _id }, { $set: { avatar } })
      return res.json({ result: { currentUser: _.omit(currentUser, 'services') } })
    })

}
