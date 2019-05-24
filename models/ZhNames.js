/*
  用户信息
*/

const mongoose = require('mongoose')

// const Schema = mongoose.Schema

const ZhNamesSchema = new mongoose.Schema({
  en_name: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: Number, // 0: 男 1：女
    required: true,
  },
}, {
  timestamps: true,
})

const User = mongoose.model('ZhNames', ZhNamesSchema)

module.exports = User
