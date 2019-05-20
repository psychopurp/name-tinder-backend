/*
  用户信息
*/

const mongoose = require('mongoose')

// const Schema = mongoose.Schema

const KzNamesSchema = new mongoose.Schema({
  en_name: String,
  name: String,
  gender: Number, // 0: 男 1：女
}, {
  timestamps: true,
})

const User = mongoose.model('KzNames', KzNamesSchema)

module.exports = User
