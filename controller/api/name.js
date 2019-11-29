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
  let {
    type,
    gender,
    lastName,
    friendId,
    isDoubleName
  } = ctx.query;
  let {
    token
  } = ctx.header
  let {
    openid
  } = ctx.session
  // console.log(ctx.header);
  console.log(ctx.query);
  // let openid = token
  let status;
  let data;
  try {
    isDoubleName = (isDoubleName === 'true')
    let user = await UserModel.findByOpenid(openid)
    let likeList = await LikesModel.findOrCreate(user.id)
    let idList = likeList.likes.map((item) => item.id)


    ///好友喜欢的名字里取出符合条件的
    if (friendId != null) {
      let friendLikeList = (await LikesModel.findOrCreate(friendId)).likes
      if (type == 0) {
        ///如果是kzname 就不用lastname
        friendLikeList = friendLikeList.filter((item) => (item.gender == gender && item.type == type && !idList.includes(item._id)))
      } else {
        friendLikeList = friendLikeList.filter((item) => (item.gender == gender && item.type == type && !idList.includes(item._id) && item.lastName == lastName))
      }

      friendLikeList = friendLikeList.map((item) => item.id)
      ///好友喜欢的名字
      friendLikeName = await getNameById(friendLikeList, type)
      friendLikeName = getArrayItems(friendLikeName, 5).map((item) => ({
        nameId: item._id,
        name: item.name,
        gender: item.gender,
        explanation: item.explanation,
        source: item.source,
        willMatch: true,
        isDoubleName: item.isDoubleName || false
      }))
      if (type == 1) {
        friendLikeName = friendLikeName.filter((item) => item.isDoubleName == isDoubleName)
      }
    }

    let myLikesSet = new Set()

    likeList.likes.forEach((item) => myLikesSet.add(item))
    likeList.disLikes.forEach((item) => myLikesSet.add(item))
    myLikesSet = Array.from(myLikesSet)
    myLikesSet = myLikesSet.map((item) => new mongoose.Types.ObjectId(item.id)) ///获取id集合
    ///从数据库取的名字 15个

    let options = [{
      $match: {
        gender: {
          $in: [0, +gender]
        },
        _id: {
          $nin: myLikesSet
        }
      }
    }, {
      $sample: {
        size: 15
      }
    }]
    if (type == 1) {
      options = [{
        $match: {
          gender: {
            $in: [0, +gender]
          },
          is_double_name: isDoubleName,
          _id: {
            $nin: myLikesSet
          }
        }
      }, {
        $sample: {
          size: 15
        }
      }]
    }

    let nameList = await MODAL_MAP[type].model.aggregate(options)
    // console.log(options)
    nameList = nameList.map((item) => ({
      nameId: item._id,
      name: item.name,
      gender: gender,
      explanation: item.explanation,
      source: item.source,
      willMatch: false,
    }))
    let resultSet
    ///合并
    if (friendId != null) {
      resultSet = Array.from(new Set(randomInsert(friendLikeName, nameList)))
    } else {
      resultSet = nameList
    }

    data = resultSet;
    status = true;
  } catch (error) {
    ctx.throw(400, error)
    status = false
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
  let {
    openid
  } = ctx.session
  let {
    nameId,
    isLike,
    lastName
  } = ctx.request.fields
  try {
    let user = await UserModel.findByOpenid(openid)
    let likes = await LikesModel.findOrCreate(user.id)
    status = await likes.addLike(nameId, isLike, lastName)

  } catch (error) {
    ctx.throw(400, error)
    status = false;
  }
  ctx.body = {
    status,
  };
}

/**
 * 获取喜欢的名字
 * @param {token} 
 */
const getLikeName = async ctx => {
  let status
  let data
  let {
    openid
  } = ctx.session
  try {
    let user = await UserModel.findByOpenid(openid)
    let likes = await LikesModel.findOrCreate(user.id)
    status = true
    data = likes.likes.map((item) => ({
      nameId: item._id,
      name: item.name,
      gender: item.gender,
      lastName: item.lastName,
      type: item.type
    }))

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
 * 获取共同喜欢名字列表
 * @param {userId,nameType} 
 * 
 */
const getCommonLikes = async ctx => {
  let status
  let data
  let {
    openid
  } = ctx.session
  let {
    userId,
    nameType,
    gender
  } = ctx.request.fields
  console.log(ctx.request.fields);
  try {
    let user = await UserModel.findByOpenid(openid)
    let likes = await LikesModel.findOrCreate(user.id)

    // console.log(user.id);

    let commonLikes = await likes.getCommonLikes(userId, nameType)

    data = commonLikes.map((item) => ({
      nameId: item._id,
      name: item.name,
      type: item.type,
      gender: item.gender,
      lastName: item.lastName
    }))
    status = true


  } catch (error) {
    ctx.throw(400, error)
    status = false;
  }
  ctx.body = {
    status,
    data,
  };
}
module.exports = {
  getName,
  addLikeName,
  getLikeName,
  getCommonLikes
};