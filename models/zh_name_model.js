/* eslint-disable prefer-template */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
let fs = require("fs");

/**
 * kzname model
 */

const ZhNameSchema = new mongoose.Schema({
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
  is_double_name: {
    type: Boolean
  },
  explanation: {
    type: String,
    trim: true
  },
  pinyin: String,
  strokes: Number,
  more: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
}, {
  timestamps: true
});

const ZhNameModel = mongoose.model("ZhNameModel", ZhNameSchema);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/name-tinder", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(val => {
//     let mywhere = new ZhNameModel({ gender: 0 });
//     ZhNameModel.findOne((err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(result);
//       }
//     });
//   });

module.exports = ZhNameModel;


// async function writeJson(params) {
//   // 现将json文件读出来
//   await mongoose.connect("mongodb://127.0.0.1:27020/name-tinder", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
//   let data = fs.readFileSync("./models/word.json");
//   let person = data.toString(); // 将二进制的数据转换为字符串
//   person = JSON.parse(person); // 将字符串转换为json对象
//   // console.log(person);
//   for (let i = 0; i < person.length; i++) {
//     // console.log(person[i]);
//     let num = (Math.random() >= 0.5) ? 2 : 1
//     let name = new ZhNameModel({
//       name: person[i].word,
//       strokes: person[i].strokes,
//       pinyin: person[i].pinyin,
//       explanation: person[i].explanation,
//       more: person[i].more,
//       is_double_name: false,
//       gender: num
//     })
//     console.log(name);
//     await ZhNameModel.create(name, (err, doc) => {
//       console.log(err);
//     })

//   }

//   console.log('完成');

// }

// writeJson("test");