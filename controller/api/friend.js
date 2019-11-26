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
    let msg
    let {
        token
    } = ctx.header
    let {
        userId,
    } = ctx.request.fields
    let openid = token
    try {
        let user = await UserModel.findByOpenid(openid)
        let friends = await FriendModel.findOrCreate(user.id)
        status = await friends.addFriend(userId)
        msg = 'ok'
    } catch (error) {
        ctx.throw(400, e)
        status = false;
    }
    ctx.body = {
        status,
        msg,
    };
}
module.exports = {
    addFriend
};