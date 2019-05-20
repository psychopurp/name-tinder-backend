// const KZName = require('./models/KzNames')

// 处理表格数据
// function handleExcel () {
//   const xlsx = require('node-xlsx')
//   const path = require('path')
//   // const cetData = require('./util/getTestData').cetData;

//   const list = xlsx.parse(path.resolve('./KZ_Name.xlsx'))
//   // console.log(list[3].data, 11111)
//   list[3].data.forEach(async (item, i) => {
//     if (i === 0) {
//       return
//     }
//     // console.log(item)
//     const enName = item[1]
//     const name = item[2]
//     // const gender = item[3]
//     // console.log(item[3]);
//     const data = await KZName.findOne({
//       en_name: enName,
//     })
//     if (!enName || !name || data) {

//     }
//     // try {
//     //   await new KZName({
//     //     en_name: enName,
//     //     name,
//     //     gender: 1,
//     //   }).save()
//     // } catch (e) {
//     //   // 重复数据，略过
//     //   console.log(e)
//     // }
//   })
//   // KZName
// }

// handleExcel()
