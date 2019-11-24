
const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const LikesModel = require("../../models/LikesModel")
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

const getName = async ctx => {
  const { type, gender } = ctx.query;

  let status;
  let data;
  try {
    let nameList = await MODAL_MAP[type].model
      .find({ gender })
      .limit(30)
      .exec();

    data = nameList;
    status = true;
    console.log("getname.....");
  } catch (error) {
    status = false;
    data = error.toString();
    console.log(error);
  }
  let len = data.length;
  ctx.body = {
    status,
    data,
    len,
  };
};



const addLikeName = async ctx => {

  let status;
  let msgGlobal = ""
  let fields = ctx.request.fields
  let { token } = ctx.header
  let openid = token
  let { nameId, isLike, lastName } = ctx.request.fields
  try {
    let userData = await UserModel.findByOpenid(openid)
    let { likes, msg } = await LikesModel.findOrCreate(userData.user.id)
    msgGlobal = msg
    if (likes != null) {
      let result = await likes.addLike(nameId, isLike, lastName)
      status = result.status
      msgGlobal = result.msg
    } else {
      status = false;

    }
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


const getLikeName = async ctx => {
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
      let { likes, msg } = await LikesModel.findOrCreate(user.id)
      status = true
      data = likes.likes
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

const getCommonLikes = async ctx => {
  let status;
  let msgGlobal = ""
  let data = null
  let { token } = ctx.header
  let { userId, nameType, gender } = ctx.request.fields
  let openid = token
  try {
    result = await UserModel.findByOpenid(openid)
    if (!result.status) {
      msgGlobal = result.msg
      status = result.status
    } else {
      let user = result.user
      let likes = (await LikesModel.findOrCreate(user.id)).likes
      // console.log(likes);
      let nameList = await likes.getCommonLikes(userId, nameType, gender)
      // console.log(user);
      status = true
      // data = likes.likes
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
module.exports = { getName, addLikeName, getLikeName, getCommonLikes };
