/*
  用户信息
*/

const mongoose = require('mongoose')

// const Schema = mongoose.Schema

const KzNamesSchema = new mongoose.Schema({
  en_name: {
    type: String,
    required: true,
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

const User = mongoose.model('KzNames', KzNamesSchema)

module.exports = User
