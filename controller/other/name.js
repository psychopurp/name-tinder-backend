const KzNames = require('../../models/KzNames')
const ZhNames = require('../../models/ZhNames')
const Users = require('../../models/Users')
const { getArrayItems, randomInsert } = require('../../utils')

const MODAL_MAP = {
  0: {
    name: 'KzNames',
    modal: KzNames,
  },
  1: {
    name: 'ZhNames',
    modal: ZhNames,
  },
}

const findUserLikeNames = async (openid, type, gender) => {
  const userData = await Users.findOne({
    openid,
  }, {
    likeGroups: 1,
  }).populate({
    path: 'likeGroups',
    select: 'users',
  })

  // .populate({
  //   path: 'likeGroups',
  //   select: 'users',
  //   populate: {
  //     path: 'users.user',
  //     select: 'userInfo openid likes',
  //     // populate: {
  //     //   path: 'likes.item',
  //     // },
  //   },
  // })
  // console.log(userData)
  // console.log(userData.likeGroups)
  // console.timeEnd(1)s
  // 姓名组
  let groupUsers = userData.likeGroups.reduce((userList, likeGroup) => {
    // console.log(likeGroup)
    // 姓名组中的user
    // const users = likeGroup.users.filter(iuser => String(iuser.user) !== String(userData._id))
    // console.log(users, 'users')
    // 每个 user 的喜欢的人名
    // const names = users.reduce((list, user) => {
    //   return list.concat(
    //     user.user.likes
    //       .filter(name => {
    //         return name.item && name.type === +type
    //       })
    //       .map(name => {
    //         // console.log(name)
    //         return ({
    //           _id: name._id,
    //           type: name.type,
    //           name: name.item.name,
    //           en_name: name.item.en_name,
    //           gender: name.item.gender,
    //           userInfo: user.user.userInfo,
    //         })
    //       })
    //   )
    // }, []) || []
    // console.log(names, 'names')
    likeGroup.users.forEach(user => {
      if (String(user.user) === String(userData._id) || userList.includes(user.user)) {
        return
      }
      userList.push(user.user)
    })
    return userList
  }, [])

  const aUsers = await Users.aggregate([
    { $match: { _id: { $in: groupUsers } } },
    {
      $project: {
        userInfo: 1,
        _id: 0,
        likes: {
          $filter: {
            input: '$likes',
            as: 'item',
            cond: {
              $eq: ['$$item.type', +type],
            },
          },
        },
      },
    },
    {
      $project: {
        userInfo: 1,
        _id: 0,
        likes: {
          $filter: {
            input: '$likes',
            as: 'item',
            cond: {
              $eq: ['$$item.gender', +gender],
            },
          },
        },
      },
    },
  ])
  let likes = []
  aUsers.forEach(auser => {
    auser.likes && auser.likes.forEach(like => {
      if (!likes.includes(like.item)) {
        likes.push(like.item)
      }
    })
  })

  likes = getArrayItems(likes, 4)
  if (likes.length > 0) {
    likes = await MODAL_MAP[type].modal.find({
      _id: { $in: likes },
    })
  }
  return likes.map(like => ({
    ...like._doc,
    otherUser: 1,
  }))
}
// 获取微信鉴权
const getNames = async ctx => {
  const {
    type,
    gender,
    /* lastName */
  } = ctx.query
  const { openid } = ctx.session
  // console.time(1)
  // console.time(2)

  // console.log(groupLikeNames, 111)
  // groupLikeNames = getArrayItems(groupLikeNames, 4)

  // KzName
  // 随机获取20个名字
  const options = [{ $match: { gender: +gender } }, { $sample: { size: 20 } }]
  if (+gender === 2) {
    options.shift()
  }
  // data = await MODAL_MAP[type].modal.aggregate(options)
  // if (+type === 0) {
  // } else {
  // console.warn(lastName)

  const [names, groupLikeNames = []] = await Promise.all([
    MODAL_MAP[type].modal.aggregate(options),
    findUserLikeNames(openid, type, gender),
  ])

  // console.timeEnd(2)

  ctx.body = {
    data: randomInsert(names, groupLikeNames).map(like => ({
      ...like,
      type,
    })),
    status: 200,
  }
}

// 更新用户信息：头像、名字、配置等
const likeName = async (ctx) => {
  const {
    type,
    id,
    name,
    gender,
  } = ctx.request.query
  const { openid } = ctx.session

  try {
    const likeNameData = {
      type: +type,
      item: id,
      modal: MODAL_MAP[type].name,
      gender,
    }

    // 中文拼接姓
    if (+type === 1) {
      likeNameData.name = decodeURIComponent(name)
    }

    await Users.findByOpenIdAndAddLikeName({
      openid,
      likeName: likeNameData,
    })

    ctx.body = {
      status: 200,
    }
  } catch (error) {
    ctx.throw(400, `添加喜欢失败: ${error.message}`)
  }
}

module.exports = {
  getNames,
  likeName,
}
