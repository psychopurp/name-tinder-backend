
const Koa = require('koa')

const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const body = require('koa-better-body')
const logger = require('koa-logger')
const session = require('koa-session-minimal')
// const request = require('request')
const MongoStore = require('koa-generic-session-mongo')
const moment = require('moment')
const { keys } = require('./config/config')
const { mongodb } = require('./utils')

// require('./getData')

app.use(body({
  multipart: true,
  querystring: require('qs'),
}))

// const WXBizDataCrypt = require('../../utils/WXBizDataCrypt')
app.proxy = true
moment.locale('zh-cn')

// error handler
onerror(app)

app.keys = keys

app.use(session({
  store: new MongoStore({
    url: mongodb,
  }),
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(`${__dirname}/public`))

app.use(views(`${__dirname}/views`, {
  extension: 'ejs',
}))

// error wrapper
app.use(async (ctx, next) => {
  ctx.session.count = ctx.session.count ? ctx.session.count + 1 : 1
  try {
    if (!ctx.request.path.includes('/api/user/wx-login') && !ctx.session.openid) {
      // 未登录
      ctx.throw(401, '微信登录失效')
      return
    }
    await next()
  } catch (e) {
    switch (e.status) {
      case 204: // No Content
      case 400: // Bad Request
      case 401: // Unauthorized
      case 403: // Forbidden
      case 404: // Not Found
      case 406: // Not Acceptable
      case 409: // Conflict
        ctx.status = e.status
        ctx.body = {
          message: e.message,
          status: e.status,
        }
        break
      default:
      case 500: // Internal Server Error
        console.error(e.stack)
        ctx.status = e.status || 500
        ctx.body = app.env === 'development' ? e.stack : e.message
        break
    }
  }
})

const routes = {
  index: require('./routes/index'),
  // 公共 api
  user: require('./routes/user'),
  // 一些公共 api
  other: require('./routes/other'),
}

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

Object.keys(routes).forEach(key => {
  const route = routes[key]
  app.use(route.routes(), route.allowedMethods())
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
