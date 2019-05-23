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
  likes: [{
    type: {
      type: Number, // 0: KzName 1: ZhName
      required: true,
    },
    modal: {
      type: String,
      required: true,
    },
    item: { type: Schema.Types.ObjectId, refPath: 'likes.modal' },
  }],
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
  likeGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'LikeGroups',
  }],
}, {
  timestamps: true,
})

class UserClass {
  static async findByOpenIdAndAddLikeName (data) {
    // 查找是否有该用户，如果有添加喜欢的名字 并去重
    const { openid, likeName: { item }, likeName } = data
    let user = await this.findOne({
      openid,
    })
    if (
      user
      && !user.likes.some(like => String(item) === String(like.item))
    ) {
      user.set({
        ...data,
        likes: user.likes.concat([likeName]),
      })
      const result = await user.save()
      return result
    }
    return null
  }
}
UserSchema.loadClass(UserClass)

const User = mongoose.model('Users', UserSchema)

module.exports = User
