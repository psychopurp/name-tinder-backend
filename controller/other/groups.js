const LikeGroups = require('../../models/LikeGroups')
const Users = require('../../models/Users')
// const KzNames = require('../../models/KzNames')
const { throwServerError } = require('../../utils')

const createGroupHander = async openid => {
  const user = await Users.findOne({
    openid,
  }, {
    likeGroups: 1,
    config: 1,
  }).populate('likeGroups')

  let id = ''
  user.likeGroups.forEach((item) => {
    if (item.creatorUserId === user.id) {
      id = item._id
    }
  })

  if (id) {
    return id
  }
  // return;
  try {
    const group = await (new LikeGroups({
      users: [{
        user,
        creator: true,
      }],
      creatorUserId: user._id,
    })).save()
    await Users.findOneAndUpdate({
      openid,
    }, {
      $push: {
        likeGroups: group,
      },
    })

    return group._id
  } catch (error) {
    return Promise.reject(new Error('createGroupHander error'))
  }
}

// 创建组
const createGroups = async ctx => {
  const { openid } = ctx.session

  try {
    const id = this.createGroupHander(openid)
    ctx.body = {
      data: {
        id,
      },
      status: 200,
    }
  } catch (error) {
    ctx.throw(400, '创建组错误')
  }
}

// 退出组
const exitGroup = async () => {
}

// 加入组
const joinGroup = async ctx => {
  const { openid } = ctx.session
  const { id } = ctx.query

  const [user, group] = await Promise.all([
    await Users.findOne({
      openid,
    }, {
      _id: 1,
    }),
    await LikeGroups.findById(id, {
      users: 1,
      _id: 0,
    }),
  ])

  // console.log(user)
  const existUser = group.users.some(userItem => String(userItem.user) === String(user._id))
  if (existUser) {
    ctx.body = {
      status: 200,
    }
    return
  }
  if (group.users.length >= 2) {
    ctx.body = {
      code: 200001, // 组内人数已经满了
      status: 200,
    }
    return
  }

  await Promise.all([
    LikeGroups.findByIdAndUpdate(id, {
      $push: {
        users: {
          user,
        },
      },
    }),
    Users.findOneAndUpdate({
      openid,
    }, {
      $push: {
        likeGroups: id,
      },
    }),
  ])
  ctx.body = {
    status: 200,
  }
}


// 5ce40fe8550a9a023d312bdc

const getGroupDetail = async ctx => {
  const { id } = ctx.params
  try {
    const group = await LikeGroups.findById(id, {
      users: 1,
      _id: 0,
    }).populate({
      path: 'users.user',
      select: 'likes userInfo',
      populate: {
        path: 'likes.item',
      },
    })

    if (!group) {
      // throwServerError(ctx, error, '获取组详情错误')
      ctx.body = {
        data: null,
        status: 200,
      }
      return
    }

    const { likes, users } = group.users.reduce((pre, item, index) => {
      const { user: { likes: iLikes, userInfo }, creator } = item
      if (index === 0) {
        pre.likes = iLikes
      } else {
        pre.likes = pre.likes
          .filter(v => v.item && iLikes.some(b => String(v.item._id) === String(b.item._id)))
          .map(like => ({
            ...like.item._doc,
            type: like.type,
          }))
      }
      pre.users.push({
        ...userInfo,
        creator,
      })
      return pre
    }, {
      likes: [],
      users: [],
    })

    ctx.body = {
      data: {
        likes,
        users,
      },
      status: 200,
    }
  } catch (error) {
    throwServerError(ctx, error, '获取组详情错误')
  }
}

const getGroups = async ctx => {
  const { openid } = ctx.session

  try {
    const user = await Users.findOne({
      openid,
    }, {
      likeGroups: 1,
    }).populate({
      path: 'likeGroups',
      select: 'users',
      populate: {
        path: 'users.user',
        select: 'userInfo openid',
      },
    })
    // console.log(user.likeGroups[0].users)

    const id = await createGroupHander(openid)
    const groups = (user._doc.likeGroups || [])
      .filter(group => group.users.length >= 2)
      .map(group => ({
        // ...group._doc,
        id: group._id,
        users: group.users.map(guser => ({
          ...guser.user.userInfo,
        })),
        displayUser: (group.users.filter(guser => guser.user.openid !== openid)[0] || { user: {} }).user.userInfo,
      }))

    ctx.body = {
      data: {
        groups,
        selfGroupId: id,
      },
      status: 200,
    }
  } catch (error) {
    // console.log(error)
    // ctx.throw(400, '获取组列表错误')
    throwServerError(ctx, error, '获取组列表错误')
  }
}


module.exports = {
  createGroups,
  exitGroup,
  joinGroup,
  getGroupDetail,
  getGroups,
}
