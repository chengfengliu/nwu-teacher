const Table = require('./models/Table.js')
const User = require('./models/User.js')

const Router = require('koa-router')
const multer = require('koa-multer')
const upload = multer({ dest: 'uploads/' })

const router = new Router()

// 路由
router.get(["/", "/workbench"], async(ctx, next) => {
  await ctx.render('index')
  await next()
})
router.post('/api/getPageCountAndColumns', Table.getPageCountAndColumns())
router.get('/api/commit', Table.commit())
router.get('/api/rollback', Table.rollback())

router.post('/api/findUser', User.findUser())
router.post('/api/modifyPassword', User.modifyPassword())
router.post('/api/addAssistant', User.addAssistant())
router.post('/api/generate', Table.generate())

router.post('/api/:table/getItem', Table.getItem())
router.post('/api/:table/addItem', Table.addItem())
router.post('/api/:table/editItem', Table.editItem())
router.post('/api/:table/removeItem', Table.removeItem())
router.post('/api/:table/uploadItem', upload.single('file'), Table.uploadItem())
router.get('/api/:table/downloadItem', Table.downloadItem())
router.get('/api/:table/downloadTemplate', Table.downloadTemplate())
router.post('/api/:table/deleteSelectedRows', Table.deleteSelectedRows())
router.post('/api/:table/computeAndDownload', Table.computeAndDownload())
router.get('/api/:table/getRules', Table.getRules())

module.exports = router