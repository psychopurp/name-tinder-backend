/* eslint-disable function-paren-newline */
/* eslint-disable indent */
/*
  用户model
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    openid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
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
    // 配置
    config: {
        type: {
            type: Number, // 0: KzName 1: ZhName

        },
        gender: {
            type: Number, // 0: 男&女 1：男 2: 女

        },
        lastName: String, // 姓
    },
},
    {
        timestamps: true,
    }
);

UserSchema.statics.findByOpenid = async function (openid) {
    try {
        let user = await this.findOne({ openid })
        if (user == null) {
            return { status: false, msg: 'this user not exist', user: null }
        }
        return { status: true, msg: 'ok', user: user }
    } catch (error) {
        return { status: false, msg: error.toString(), user: null }
    }
}

const model = mongoose.model("UserModel", UserSchema);
module.exports = model
