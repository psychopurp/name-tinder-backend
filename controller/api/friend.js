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
        openid
    } = ctx.session
    let {
        userId,
    } = ctx.request.fields
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

/**
 * 获取好友
 * @param {} 
 */
const getFriends = async ctx => {
    let {
        openid
    } = ctx.session
    let data = null
    let status = true
    try {
        let user = await UserModel.findByOpenid(openid)
        let friends = await FriendModel.findOrCreate(user.id)
        let userSet = new Set()
        for await (let item of friends.members) {
            let friend = await UserModel.findById(item);
            console.log(friend.userInfo);
            userSet.add({
                userId: item,
                name: friend.userInfo.nickName,
                gender: friend.userInfo.gender,
                avatar: friend.userInfo.avatarUrl
            })
        }
        data = Array.from(userSet)


    } catch (error) {
        ctx.throw(400, e)
        status = false;
    }
    ctx.body = {
        status,
        data,
    };

}
module.exports = {
    addFriend,
    getFriends
};