/*
  用户信息
*/

const mongoose = require('mongoose')

// const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true,
  },
  // student: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Students',
  // },
  userInfo: {
    nickName: String,
    gender: String,
    language: String,
    city: String,
    province: String,
    country: String,
    avatarUrl: String,
  },
  location: Object,
  session_key: {
    type: String,
    required: true,
  },
  like: {
    id: String,
    name: String,
    category: '',
  },
}, {
  timestamps: true,
})

const User = mongoose.model('Users', UserSchema)

module.exports = User
