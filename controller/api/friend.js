const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const LikesModel = require("../../models/LikesModel")
const FriendModel = require("../../models/FriendModel")
const UserModel = require("../../models/Users")



/**
 * 添加好友
 * @param {userId} 
 * 
 */
const addFriend = async ctx => {
    let status;
    let msgGlobal = ""
    let {
        token
    } = ctx.header
    let {
        userId,
    } = ctx.request.fields
    let openid = token
    try {
        result = await UserModel.findByOpenid(openid)
        if (!result.status) {
            msgGlobal = result.msg
            status = result.status
        } else {
            ///获取自己
            let user = result.user
            // console.log(user);
            let friends = await FriendModel.findOrCreate(user.id)
            let resultObject = await friends.addFriend(userId)
            if (resultObject.status) {
                status = true
                msgGlobal = 'ok'
            } else {
                status = false
            }
        }
    } catch (error) {
        status = false;
        msgGlobal = error.toString()
    }
    msg = msgGlobal
    ctx.body = {
        status,
        msg,
    };
}
module.exports = {
    addFriend
};