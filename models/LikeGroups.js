/*
  用户信息
*/

const mongoose = require('mongoose')

const LikeGroupsSchema = new mongoose.Schema({
  group: [{
    userid: {
      type: String,
      require: true,
    },
    creator: {
      type: Boolean,
      default: false,
    },
  }],
}, {
  timestamps: true,
})

const User = mongoose.model('LikeGroups', LikeGroupsSchema)

module.exports = User
