/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
let fs = require("fs");

/**
 * kzname model
 */

const KzNamesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    gender: {
      type: Number, // 0为男女 1为男 2为女
      required: true
    },
    explanation: {
      type: String,
      trim: true
    },
  },
  { timestamps: true }
);

const KzNameModel = mongoose.model("KzNameModel", KzNamesSchema);

module.exports = KzNameModel;

// async function writeJson(params) {
//   // 现将json文件读出来
//   await mongoose.connect("mongodb://127.0.0.1:27017/name-tinder", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
//   let data = fs.readFileSync("./models/kz.json");
//   let person = data.toString(); // 将二进制的数据转换为字符串
//   person = JSON.parse(person); // 将字符串转换为json对象
//   person.forEach(async (item, index) => {
//     console.log(item);
//     let name = new KzNameModel({
//       id: item._id,
//       name: item.name,
//       gender: item.gender,
//       explanation: item.explanation
//     });
//     console.log(name);
//     await KzNameModel.create(name, function(err, docs) {
//       if (err) console.log(err + "   errrr");
//       else console.log("保存成功：" + docs);
//     });
//   });
// }

// writeJson("test");
