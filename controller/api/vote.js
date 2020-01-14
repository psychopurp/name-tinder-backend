const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const VotesModel = require("../../models/VotesModel")
const UserModel = require("../../models/Users")
const LikesModel = require("../../models/LikesModel")



/**
 * 添加投票
 * @param {names} 
 * 
 */
const addVote = async ctx => {
    let status;
    let msg
    let {
        openid
    } = ctx.session
    let {
        names
    } = ctx.request.fields
    try {
        let user = await UserModel.findByOpenid(openid)
        let likeList = await LikesModel.findOrCreate(user.id)
        names = likeList.filter((item) => (names.includes(item._id)))
        let Vote = await VotesModel.addVote(user.id, names)

        status = await friends.addFriend(userId)
        msg = 'ok'
    } catch (error) {
        ctx.throw(400, error)
        status = false;
    }
    ctx.body = {
        status,
        msg,
        vote
    };
}

/**
 * 删除投票
 * @param {voteId} 
 */
const delVote = async ctx => {
    let {
        openid
    } = ctx.session
    let {
        voteId
    } = ctx.request.fields

    let data = null
    let status = true
    try {
        let vote = await VotesModel.findById(voteId)
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

/**
 * 参与投票
 * @param {voteId,nameId}
 */
const vote = async ctx => {
    let {
        openid
    } = ctx.session
    let {
        nameId,
        voteId
    } = ctx.request.fields

    let data = null
    let status = true
    try {
        let user = await UserModel.findByOpenid(openid)
        let vote = await VotesModel.findById(voteId)

        vote.members.addToSet(user.id)

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
        ctx.throw(400, error)
        status = false;
    }
    ctx.body = {
        status,
        data,
    };



}

/**
 * 获取自己的投票
 * @param
 */
const getVotes = async ctx => {
    let {
        openid
    } = ctx.session

    let data = null
    let status = true
    try {
        let user = await UserModel.findByOpenid(openid)
        let votes = await VotesModel.find({
            userId: user.id
        })
        data = votes

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
    addVote,
    delVote,
    vote,
    getVotes
};