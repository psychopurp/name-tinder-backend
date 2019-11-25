const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");
const LikesModel = require("../../models/LikesModel")
const UserModel = require("../../models/Users")
const {
  getArrayItems,
  randomInsert
} = require("../../utils");

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

/**
 * 
 * @param {type,gender,lastName,friendId} 
 */
const getName = async ctx => {
  const {
    type,
    gender,
    lastName,
    friendId
  } = ctx.query;
  let {
    token
  } = ctx.header
  let openid = token
  let status;
  let data;
  try {
    let user = (await UserModel.findByOpenid(openid)).user
    let likeList = (await LikesModel.findOrCreate(user.id)).likes
    let friendLikeList = (await LikesModel.findOrCreate(friendId)).likes.likes
    let idList = likeList.likes.map((item) => item.id)

    ///好友喜欢的名字里取出符合条件的
    friendLikeList = friendLikeList.filter((item) => (item.gender == gender && item.type == type && !idList.includes(item._id) && item.lastName == lastName))
    friendLikeList = friendLikeList.map((item) => item.id)
    ///好友喜欢的名字
    let friendLikeName = await getNameById(friendLikeList, type)
    friendLikeName = getArrayItems(friendLikeName, 5).map((item) => ({
      nameId: item.id,
      name: item.name,
      gender: item.gender,
      explanation: item.explanation,
      source: item.source,
      willMatch: true
    }))

    let myLikesSet = new Set()

    likeList.likes.forEach((item) => myLikesSet.add(item))
    likeList.disLikes.forEach((item) => myLikesSet.add(item))
    myLikesSet = Array.from(myLikesSet)
    myLikesSet = myLikesSet.map((item) => new mongoose.Types.ObjectId(item.id)) ///获取id集合
    ///从数据库取的名字 15个
    let nameList = await MODAL_MAP[type].model.aggregate([{
        $match: {
          gender: {
            $in: [0, +gender]
          },
          _id: {
            $nin: myLikesSet
          }
        }
      },
      {
        $sample: {
          size: 15
        }
      }
    ])
    nameList = nameList.map((item) => ({
      nameId: item.id,
      name: item.name,
      gender: item.gender,
      explanation: item.explanation,
      source: item.source,
      willMatch: false
    }))

    ///合并
    let resultSet = Array.from(new Set(randomInsert(friendLikeName, nameList)))

    data = resultSet;
    status = true;
  } catch (error) {
    ctx.throw(400, error)
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

///渲染id list
async function getNameById(ids, type) {
  let nameList = []
  for (let i = 0; i < ids.length; i++) {
    let name = await MODAL_MAP[type].model.findById(ids[i])
    nameList.push(name)
  }
  return nameList
}


/**
 * 添加喜欢的名字
 * @param {nameId,isLike,lastName} 
 */
const addLikeName = async ctx => {

  let status;
  let msgGlobal = ""
  let fields = ctx.request.fields
  let {
    token
  } = ctx.header
  let openid = token
  let {
    nameId,
    isLike,
    lastName
  } = ctx.request.fields
  try {
    let userData = await UserModel.findByOpenid(openid)
    let {
      likes,
      msg
    } = await LikesModel.findOrCreate(userData.user.id)
    msgGlobal = msg
    if (likes != null) {
      let result = await likes.addLike(nameId, isLike, lastName)
      status = result.status
      msgGlobal = result.msg
    } else {
      status = false;

    }
  } catch (error) {
    ctx.throw(400, e)
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

/**
 * 获取喜欢的名字
 * @param {token} 
 */
const getLikeName = async ctx => {
  let status;
  let msgGlobal = ""
  let data = null
  let {
    token
  } = ctx.header
  let openid = token
  try {
    result = await UserModel.findByOpenid(openid)
    if (!result.status) {
      msgGlobal = result.msg
      status = result.status
    } else {
      let user = result.user
      let {
        likes,
        msg
      } = await LikesModel.findOrCreate(user.id)
      status = true
      data = likes.likes.map((item) => ({
        nameId: item._id,
        name: item.name,
        gender: item.gender,
        lastName: item.lastName,
        type: item.type
      }))
      msgGlobal = msg
    }
  } catch (error) {
    ctx.throw(400, e)
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

/**
 * 获取共同喜欢名字列表
 * @param {userId,nameType} 
 * 
 */
const getCommonLikes = async ctx => {
  let status;
  let msgGlobal = ""
  let data = null
  let {
    token
  } = ctx.header
  let {
    userId,
    nameType,
    gender
  } = ctx.request.fields
  let openid = token
  try {
    result = await UserModel.findByOpenid(openid)
    if (!result.status) {
      msgGlobal = result.msg
      status = result.status
    } else {
      let user = result.user
      let likes = (await LikesModel.findOrCreate(user.id)).likes
      let resultObject = await likes.getCommonLikes(userId, nameType)
      if (resultObject.status) {
        data = resultObject.data.map((item) => ({
          nameId: item._id,
          name: item.name,
          type: item.type,
          gender: item.gender,
          lastName: item.lastName
        }))
        status = true
        msgGlobal = 'ok'
      } else {
        status = false
      }
    }
  } catch (error) {
    ctx.throw(400, e)
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
module.exports = {
  getName,
  addLikeName,
  getLikeName,
  getCommonLikes
};