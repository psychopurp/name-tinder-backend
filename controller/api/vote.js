const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const VotesModel = require("../../models/VotesModel")
const UserModel = require("../../models/Users")
const LikesModel = require("../../models/LikesModel")



/**
 * 添加投票
 * @param {names} 
 * @return {voteId}
 * 
 */
const addVote = async ctx => {
    let status=true,data;
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
        names = likeList.likes.filter((item) => (names.includes(item.id)))
        let vote = await VotesModel.addVote(user.id, names)
        data={voteId:vote.id}
        msg = 'ok'
    } catch (error) {
        ctx.throw(400, error)
        status = false;
    }
    ctx.body = {
        status,
        msg,
        data
        
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
        voteId,
    } = ctx.request.fields
    let data
    let status = true
    try {
        let resutl = await VotesModel.remove({_id:voteId})
        data=resutl
    } catch (e) {
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
 * 如果用户不传voteId ，则返回用户自己的投票
 * @param {voteId or userId}
 */
const getVotes = async ctx => {
    let {
        openid
    } = ctx.session
    let {
        voteId
    } = ctx.query
    let data;
    let status = true
    try {
        let votes
        if(!voteId){
            let user = await UserModel.findByOpenid(openid)
             votes=await VotesModel.find({userId:user.id}).populate({path:'userId',select:'userInfo'})
             data=votes.map(item=>({voteId:item.id,
                createdAt:item.createdAt,
                members:item.members,
                names:item.names,
                userInfo:item.userId.userInfo}))
        }else{
         votes = await VotesModel.findById(voteId).populate({path:'userId',select:'userInfo',options:{ $project : { userId : 1 } } })
         data={
            voteId:votes.id,
            createdAt:votes.createdAt,
            members:votes.members,
            names:votes.names,
            userInfo:votes.userId.userInfo
        }
        }
        

    } catch (e) {
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