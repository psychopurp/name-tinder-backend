const LikeGroups = require('../../models/LikeGroups')
const Users = require('../../models/Users')

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
        likeGroups: group,
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
  console.log(id)
  try {
    const group = await LikeGroups.findById('5ce40fe8550a9a023d312bdc', {
      users: 1,
      _id: 0,
    }).populate('users.user')
    ctx.body = {
      data: group,
      status: 200,
    }
  } catch (error) {
    console.log(error)
    ctx.throw(400, '获取组详情错误')
  }
}

const getGroups = async ctx => {
  const { openid } = ctx.session

  try {
    const user = await Users.findOne({
      openid,
    }, {
      likeGroups: 1,
    }).populate('likeGroups').populate('likeGroups.users.user')
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
    ctx.throw(400, '获取组列表错误')
  }
}


module.exports = {
  createGroups,
  exitGroup,
  joinGroup,
  getGroupDetail,
  getGroups,
}
