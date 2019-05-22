const LikeGroups = require('../../models/LikeGroups')
const Users = require('../../models/Users')

const createGroupHander = async openid => {
  const user = await Users.findOne({
    openid,
  }, {
    likeGroups: 1,
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
  const { groupId } = ctx.query.groupId

  const group = await LikeGroups.findOne({
    groupId,
  })

  if (group.users.length >= 2) {
    console.log(1111)
  }
  console.log(group.users)
  return
  Promise.all([
    Users.findOneAndUpdate({
      openid,
    }, {
      $push: { groups: groupId },
    }),
    LikeGroups.findOne({
      groupId,
    }),
  ], results => {
    const user = results[0]
    const group = results[1]
    console.warn(user, group)
  }).catch(() => {
    ctx.throw(400, '加入组失败')
  })
}

const getGroupDetail = async ctx => {
  const groupId = ctx.query.groupId
  console.warn(groupId)
}

const getGroups = async ctx => {
  const { openid } = ctx.session

  try {
    const user = await Users.findOne({
      openid,
    }, {
      likeGroups: 1,
    }).populate('likeGroups').populate('likeGroups.users')
    // console.log(user.likeGroups[0].users)

    const id = await createGroupHander(openid)

    ctx.body = {
      data: {
        groups: (user.likeGroups || []).filter(group => group.users.length >= 2),
        selfGroupId: id,
      },
      status: 200,
    }
  } catch (error) {
    ctx.throw(400, '获取组错误')
  }
}


module.exports = {
  createGroups,
  exitGroup,
  joinGroup,
  getGroupDetail,
  getGroups,
}
