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
// 获取微信鉴权
const getNames = async ctx => {
  const { type, gender, lastName } = ctx.query
  const { openid } = ctx.session

  const userData = await Users.findOne({
    openid,
  }, {
    likeGroups: 1,
  }).populate({
    path: 'likeGroups',
    select: 'users',
    populate: {
      path: 'users.user',
      select: 'userInfo openid likes',
      populate: {
        path: 'likes.item',
      },
    },
  })

  // console.log(userData.likeGroups)
  // 姓名组
  let groupLikeNames = userData.likeGroups.reduce((pre, likeGroup) => {
    // console.log(likeGroup)
    // 姓名组中的user
    const users = likeGroup.users.filter(iuser => iuser.openid !== openid)
    // console.log(users)
    // 每个 user 的喜欢的人名
    const names = users.reduce((list, user) => {
      return list.concat(
        user.user.likes
          .filter(name => {
            return name.item && name.type === +type
          })
          .map(name => {
            // console.log(name)
            return ({
              _id: name._id,
              type: name.type,
              name: name.item.name,
              en_name: name.item.en_name,
              gender: name.item.gender,
              userInfo: user.user.userInfo,
            })
          })
      )
    }, []) || []
    return pre.concat(names)
  }, [])


  groupLikeNames = getArrayItems(groupLikeNames, 4)
  // console.log(groupLikeNames)

  let data = []
  // KzName
  // 随机获取20个名字
  const options = [{ $match: { gender: +gender } }, { $sample: { size: 20 } }]
  if (+gender === 2) {
    options.shift()
  }
  data = await MODAL_MAP[type].modal.aggregate(options)
  // if (+type === 0) {
  // } else {
  console.warn(lastName)
  //   // data = await ZhNames.aggregate([{ $match: { gender: +gender } }, { $sample: { size: 20 } }])
  // }
  // 随机获取20个名字
  // const data = await KzNames.aggregate([{ $sample: { size: 20 } }])
  // console.log(data)
  ctx.body = {
    data: randomInsert(data, groupLikeNames),
    status: 200,
  }
}

// 更新用户信息：头像、名字、配置等
const likeName = async (ctx) => {
  const { type, id } = ctx.request.query
  const { openid } = ctx.session

  try {
    await Users.findByOpenIdAndAddLikeName({
      openid,
      likeName: {
        type: +type,
        item: id,
        modal: MODAL_MAP[type].name,
      },
    })

    // await Users.findOneAndUpdate({
    //   openid,
    // }, {
    //   $addToSet: {
    //     'likes.item': id,
    //     likes: {
    //       type: +type,
    //       item: id,
    //       modal: MODAL_MAP[type],
    //     },
    //   },
    // })
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
