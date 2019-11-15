/* eslint-disable prefer-template */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
let fs = require("fs");

/**
 * kzname model
 */

const ZhNameSchema = new mongoose.Schema(
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
    is_double_name: {
      type: Boolean
    },
    explanation: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      trim: true
    },
    id: { type: Number }
  },
  { timestamps: true }
);

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
