const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");

// mongoose.connect("mongodb://127.0.0.1:27017/name-tinder");

const getName = async ctx => {
  let query = ctx.query;
  let status;
  let data;
  try {
    let nameList = await ZhNameModel.find({ is_double_name: true })
      .limit(30)
      .exec();
    data = nameList;
    status = true;
    console.log("getname.....");
  } catch (error) {
    status = false;
    data = error.toString();
    console.log(error);
  }
  let len = data.length;
  ctx.body = {
    // data.length,
    status,
    data,
    len
  };
};

module.exports = { getName };
