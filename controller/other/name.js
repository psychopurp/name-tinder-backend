const KzNames = require('../../models/KzNames')

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

module.exports = {
  getNames,
}
