const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const VotesModel = require("../../models/VotesModel");
const UserModel = require("../../models/Users");
const LikesModel = require("../../models/LikesModel");

/**
 * 添加投票
 * @param {names}
 * @return {voteId}
 *
 */
const addVote = async ctx => {
    let status = true,
        data;
    let msg;
    let {
        openid
    } = ctx.session;
    let {
        names
    } = ctx.request.fields;
    try {
        let user = await UserModel.findByOpenid(openid);
        let likeList = await LikesModel.findOrCreate(user.id);
        names = likeList.likes.filter(item => names.includes(item.id));
        let vote = await VotesModel.addVote(user.id, names);
        data = {
            voteId: vote.id
        };
        msg = "ok";
    } catch (error) {
        ctx.throw(400, error);
        status = false;
    }
    ctx.body = {
        status,
        msg,
        data
    };
};

/**
 * 删除投票
 * @param {voteId}
 */
const delVote = async ctx => {
    let {
        openid
    } = ctx.session;
    let {
        voteId
    } = ctx.request.fields;
    let data;
    let status = true;
    try {
        let resutl = await VotesModel.remove({
            _id: voteId
        });
        data = resutl;
    } catch (e) {
        ctx.throw(400, e);
        status = false;
    }
    ctx.body = {
        status,
        data
    };
};

/**
 * 参与投票
 * @param {voteId,nameId}
 */
const vote = async ctx => {
    let {
        openid
    } = ctx.session;
    let {
        nameId,
        voteId
    } = ctx.request.fields;

    let data = null;
    let status = true;
    try {
        let user = await UserModel.findByOpenid(openid);
        let vote = await VotesModel.findById(voteId);

        if (vote.userId == user.id) {
            status = false;
            data = "不能给自己投票";
        } else {
            // let vote = await VotesModel.findByIdAndUpdate(voteId,{$addToSet:{members:{_id:user.id}}})
            let name = vote.names.id(nameId);

            name.members.addToSet(user.id);
            name.voteNum = name.members.length;
            vote.save();
            data = name;
        }
    } catch (error) {
        ctx.throw(400, error);
        status = false;
    }
    ctx.body = {
        status,
        data
    };
};

/**
 * 获取自己的投票
 * 如果用户不传voteId ，则返回用户自己的投票
 * @param {voteId or userId}
 */
const getVotes = async ctx => {
    let {
        openid
    } = ctx.session;
    let {
        voteId
    } = ctx.query;
    let data;
    let status = true;
    try {
        let votes;
        if (!voteId) {
            let user = await UserModel.findByOpenid(openid);
            votes = await VotesModel.find({
                userId: user.id
            }).populate({
                path: "userId",
                select: "userInfo"
            });
            data = votes.map(item => ({
                voteId: item.id,
                createdAt: item.createdAt,
                members: item.members,
                names: item.names,
                userInfo: item.userId.userInfo
            }));
        } else {
            let user = await UserModel.findByOpenid(openid)
            votes = await VotesModel.findById(voteId)
                .populate({
                    path: "userId",
                    select: "userInfo ",
                    options: {
                        $project: {
                            userId: 1
                        }
                    }
                })
                .populate("names.members._id", "userInfo");
            //  user = {
            //     id: "5cf09c65f7cd503d63d3f597"
            // };
            //  let index=-1
            let voted=false
            let names = [];
            for (let i = 0; i < votes.names.length; i++) {
                let index = -1;
                let members = votes.names[i].members.map(k => {
                    if (k._id._id.toString() == user.id) {
                        index = i;
                        voted=true
                        // console.log('---------'+index);
                    }
                    return {
                        userId: k._id._id,
                        userInfo: k._id.userInfo
                    };
                });
                let name = votes.names[i];
                names.push({
                    voteNum: name.voteNum,
                    members: members,
                    createdAt: name.createdAt,
                    type: name.type,
                    name: name.name,
                    gender: name.gender,
                    model: name.model,
                    _id: name._id,
                    lastName: name.lastName,
                    index: index
                });
                //  console.log(members);
                //  names.mem=members
                //  names[i].idx=index
                //  console.log(names);
            }

            console.log(votes);
            data = {
                voted: voted,
                //  index:index,
                voteId: votes.id,
                createdAt: votes.createdAt,
                members: votes.members,
                names: names,
                userInfo: votes.userId.userInfo,
                userId:votes.userId._id,
                itSelf:votes.userId._id.toString()==user.id.toString()
            };
        }
    } catch (e) {
        ctx.throw(400, e);
        status = false;
    }
    ctx.body = {
        status,
        data
    };
};

module.exports = {
    addVote,
    delVote,
    vote,
    getVotes
};