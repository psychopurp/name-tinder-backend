/*
  用户信息
*/

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LikeGroupsSchema = new mongoose.Schema({
  users: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      require: true,
    },
    creator: {
      type: Boolean,
      default: false,
    },
  }],
  creatorUserId: String,
}, {
  timestamps: true,
})

const User = mongoose.model('LikeGroups', LikeGroupsSchema)

module.exports = User
