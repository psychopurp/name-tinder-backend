// const debug = require('debug')('techmeme-backend:error');
const config = require('../config/config')

const PRODUCTION = process.env.NODE_ENV === 'production'

let mongodb = 'mongodb://127.0.0.1:27017/name-tinder'
let sessionSecret = 'test'

if (PRODUCTION) {
  const { mongo } = config
  mongodb = `mongodb://${mongo.user}:${encodeURIComponent(mongo.password)}@${mongo.host}:${mongo.port}/${mongo.database}?authSource=${mongo.authSource}`;
  ({ sessionSecret } = config)
}

const throwServerError = (ctx, error, message, errorCode = 400) => {
  ctx.throw(errorCode, `${error.message}: ${message}`)
}

module.exports = {
  mongodb,
  sessionSecret,
  throwServerError,
}
