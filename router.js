const mysqlConfig = require('./mysqlConfig')
const Table = require('./models/Table.js')
const User = require('./models/User.js')
const Mooc = require('./models/Mooc.js')

const mysql = require('mysql')
const Router = require('koa-router')
const multer = require('koa-multer')
const upload = multer({ dest: 'uploads/' })

const router = new Router()

// 连接MySQL数据库
const connection = mysql.createConnection(mysqlConfig)

// 路由
router.get(["/", "/workbench"], async(ctx, next) => {
  await ctx.render('index')
  await next()
})
router.post('/api/getPageCount', Table.getPageCount(connection))
router.post('/api/findUser', User.findUser(connection))
router.post('/api/modifyPassword', User.modifyPassword(connection))
router.post('/api/addAssistant', User.addAssistant(connection))
// mooc
router.post('/api/getmoocItem', Mooc.getmoocItem(connection))
router.post('/api/addmoocItem', Mooc.addmoocItem(connection))
router.post('/api/removemoocItem', Mooc.removemoocItem(connection))
router.get('/api/commitmoocItem', Mooc.commitmoocItem(connection))
router.get('/api/rollbackmoocItem', Mooc.rollbackmoocItem(connection))
router.post('/api/editmoocItem', Mooc.editmoocItem(connection))
router.post('/api/searchmoocItem', Mooc.searchmoocItem(connection))
router.post('/api/uploadmoocItem', upload.single('file'), Mooc.uploadmoocItem(connection))
router.get('/api/downloadmoocItem', Mooc.downloadmoocItem(connection))

module.exports = router