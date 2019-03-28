const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const bodyParser = require('koa-bodyparser')

const config = require('./webpack.config')
const mysqlConfig = require('./mysqlConfig')
const User = require('./models/User.js')
const Mooc = require('./models/Mooc.js')

const Koa = require('koa')
const mysql = require('mysql')
const Router = require('koa-router')
const views = require('koa-views')

const app = new Koa()
const router = new Router()
// 加载中间件
app.use(views(path.join(__dirname, 'views')))
app.use(bodyParser({enableTypes:['json', 'form', 'text'], formLimit: '1mb'}))

// 打包工具
// const configResult = config(process.env.NODE_ENV)
// const compiler = webpack(configResult)
// if(process.env.NODE_ENV === 'development') {
//   console.log('env development')
//   app.use(webpackDevMiddleware(compiler, { noInfo: false, publicPath: configResult.output.publicPath, stats: {colors: true} }))
//   app.use(webpackHotMiddleware(compiler), {log: false, heartbeat: 2000})
// } else if(process.env.NODE_ENV === 'production') {
//   console.log('env production')
//   app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: configResult.output.publicPath}))
// }
// 连接MySQL数据库
const connection = mysql.createConnection(mysqlConfig)

// 路由
router.get('/', async(ctx, next) => {
  await ctx.render('index')
  await next()
})
router.post('/api/findUser', User.findUser(connection))
router.post('/api/addAssistant', User.addAssistant(connection))
router.post('/api/addmoocItem', Mooc.addmoocItem(connection))
router.post('/api/removemoocItem', Mooc.removemoocItem(connection))
router.post('/api/editmoocItem', Mooc.editmoocItem(connection))
router.post('/api/searchmoocItem', Mooc.searchmoocItem(connection))

app.use(router.routes()).use(router.allowedMethods())

connection.connect(
  app.listen(parseInt(process.env.NODE_PORT), () => {
    console.log(`listening on ${parseInt(process.env.NODE_PORT)}`)
  })
)

