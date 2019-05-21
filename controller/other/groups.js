// const LikeGroups = require('../../models/LikeGroups')
// const Users = require('../../models/Users')

// // 创建组
// const createGroups = async ctx => {
//   const { openid } = ctx.session

//   const user = await Users.findOne({
//     openid,
//   })
//   console.log(user)
//   // 随机获取20个名字
//   // const data = await KzNames.aggregate([{ $sample: { size: 20 } }])
//   // ctx.body = {
//   //   data,
//   //   status: 200,
//   // }
// }

// // 加入组
// const exitGroup = async () => {
// }

// // 加入组
// const joinGroup = async ctx => {
//   const { openid } = ctx.session
//   const { groupId } = ctx.query.groupId

//   Promise.all([
//     Users.findOneAndUpdate({
//       openid,
//     }, {
//       $push: { groups: groupId },
//     }),
//     LikeGroups.findOne({
//       groupId,
//     }),
//   ], results => {
//     const user = results[0]
//     const group = results[1]
//   }).catch(() => {
//     ctx.throw(400, '加入组失败')
//   })
// }

// const getGroupDetail = async ctx => {
//   const groupId = ctx.query.groupId
// }

// module.exports = {
//   createGroups,
//   exitGroup,
//   joinGroup,
//   getGroupDetail,
// }
