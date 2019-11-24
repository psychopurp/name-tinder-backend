
const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const GroupModel = require("../../models/FriendModel")
const UserModel = require("../../models/Users")

// mongoose.connect("mongodb://127.0.0.1:27017/name-tinder");

const MODAL_MAP = {
    0: {
        name: "KzNames",
        model: KzNameModel
    },
    1: {
        name: "ZhNames",
        model: ZhNameModel
    }
};



const addGroup = async ctx => {

    let status;
    let msgGlobal = ""
    let fields = ctx.request.fields
    let { token } = ctx.header
    let openid = token
    let { nameId, isLike, nameType, lastName } = ctx.request.fields
    try {
        let userData = await UserModel.findByOpenid(openid)
        let user = userData.user
        let result = await GroupModel.create({ creatorId: user.id })
        status = result.status
        msgGlobal = result.msg


    } catch (error) {
        status = false;
        msgGlobal = error.toString()
    }
    msg = msgGlobal
    ctx.body = {
        status,
        fields,
        msg
    };
}


const getGroups = async ctx => {
    let status;
    let msgGlobal = ""
    let data = null
    let { token } = ctx.header
    let openid = token
    try {
        result = await UserModel.findByOpenid(openid)
        if (!result.status) {
            msgGlobal = result.msg
            status = result.status
        } else {
            let user = result.user
            let groups = await GroupModel.find({ creatorId: user.id }).populate({ path: 'members', select: "userInfo" })
            status = true
            data = groups
            console.log(user);
            msgGlobal = msg
        }
    } catch (error) {
        status = false;
        msgGlobal = error.toString()
    }
    msg = msgGlobal
    ctx.body = {
        status,
        data,
        msg,
    };
}
module.exports = { addGroup, getGroups };
