const mongoose = require("mongoose");
const KzNameModel = require("../../models/kz_name_model");
const ZhNameModel = require("../../models/zh_name_model");

// mongoose.connect("mongodb://127.0.0.1:27017/name-tinder");

const MODAL_MAP = {
  0: {
    name: "KzNames",
    model: KzNameModel
  },
  1: {
    name: "ZhNames",
    model: ZhNameModel
  }
};

const getName = async ctx => {
  const { type, gender } = ctx.query;

  let status;
  let data;
  try {
    let nameList = await MODAL_MAP[type].model
      .find({ gender })
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
    status,
    data,
    len
  };
};

module.exports = { getName };
