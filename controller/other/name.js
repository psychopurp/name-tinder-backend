const KzNames = require('../../models/KzNames')
const Users = require('../../models/Users')

// 获取微信鉴权
const getNames = async ctx => {
  const { type, gender, lastName } = ctx.query

  let data = []

  // KzName
  if (+type === 0) {
    // 随机获取20个名字
    const options = [{ $match: { gender: +gender } }, { $sample: { size: 20 } }]
    if (+gender === 2) {
      options.shift()
    }
    data = await KzNames.aggregate(options)
  } else {
    console.warn(lastName)
    // data = await ZhNames.aggregate([{ $match: { gender: +gender } }, { $sample: { size: 20 } }])
  }
  // 随机获取20个名字
  // const data = await KzNames.aggregate([{ $sample: { size: 20 } }])

  ctx.body = {
    data,
    status: 200,
  }
}

// 更新用户信息：头像、名字、配置等
const likeName = async (ctx) => {
  const { type, id } = ctx.request.query
  const { openid } = ctx.session

  try {
    await Users.findOneAndUpdate({
      openid,
    }, {
      $push: {
        likes: {
          type: +type,
          item: id,
        },
      },
    })
    ctx.body = {
      status: 200,
    }
  } catch (error) {
    ctx.throw(400, '添加喜欢失败')
  }
}

module.exports = {
  getNames,
  likeName,
}
