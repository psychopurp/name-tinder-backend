/*
  用户信息
*/

const mongoose = require('mongoose')

const Schema = mongoose.Schema

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
  // 配置
  config: {
    type: {
      type: Number, // 0: KzName 1: ZhName
      required: true,
    },
    gender: {
      type: Number, // 0: 男 1：女 2: 男&女
      required: true,
    },
    lastName: String, // 姓
  },
  // 喜欢的组
  likeGroups: {
    type: Schema.Types.ObjectId,
    ref: 'LikeGroups',
  },
}, {
  timestamps: true,
})

const User = mongoose.model('Users', UserSchema)

module.exports = User
