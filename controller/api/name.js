
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
  let msg = ""
  let fields = ctx.request.fields
  let { token } = ctx.header
  let openid = token
  let { nameId, isLike, nameType, lastName } = ctx.request.fields
  try {
    let userData = await UserModel.findByOpenid(openid)
    let { likes, msg } = await LikesModel.findOrCreate(userData.user.id)
    if (likes != null) {
      let result = await likes.addLike(nameId, isLike, nameType, lastName)
      status = result.status
      msg = result.msg
    } else {
      status = false;
      msg = msg
    }
  } catch (error) {
    status = false;
    msg = error.toString()
  }
  ctx.body = {
    status,
    fields,
    msg
  };
}


const getLikeName = async ctx => {
  let status;
  let msg = ""
  let result
  let data = null
  let { token } = ctx.header
  let openid = token
  try {
    result = await UserModel.findByOpenid(openid)
    if (!result.status) {
      msg = result.msg
      status = result.status
    } else {
      let user = result.user
      let likes = await LikesModel.findOrCreate(user.id)
      status = result.status
      msg = result.msg
      data = likes.likes
    }
  } catch (error) {
    status = false;
    msg = error.toString()
  }
  ctx.body = {
    status,
    data,
    msg,
  };
}
module.exports = { getName, addLikeName, getLikeName };
