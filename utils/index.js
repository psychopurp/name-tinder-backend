// const debug = require('debug')('techmeme-backend:error');
const config = require("../config/config");

const PRODUCTION = process.env.NODE_ENV === "production";

let mongodb = "mongodb://name-mongo:27017/name-tinder";
let sessionSecret = "test";

if (PRODUCTION) {
  const { mongo } = config;
  mongodb = `mongodb://${mongo.user}:${encodeURIComponent(mongo.password)}@${
    mongo.host
  }:${mongo.port}/${mongo.database}?authSource=${mongo.authSource}`;
  ({ sessionSecret } = config);
}

const throwServerError = (ctx, error, message, errorCode = 400) => {
  ctx.throw(errorCode, `${error.message}: ${message}`);
};

const getArrayItems = (arr, num) => {
  let copyArr = arr;
  // 取出的数值项,保存在此数组返回
  let resultArr = [];
  for (let i = 0; i < num; i++) {
    if (copyArr.length > 0) {
      let arrIndex = Math.floor(Math.random() * copyArr.length);
      resultArr[i] = copyArr[arrIndex];
      copyArr.splice(arrIndex, 1);
    } else {
      break;
    }
  }
  return resultArr;
};

const randomInsert = (arr1, arr2) => {
  arr1.forEach(value => arr2.splice(Math.random() * arr2.length, 0, value));
  return arr2;
};
module.exports = {
  mongodb,
  sessionSecret,
  throwServerError,
  getArrayItems,
  randomInsert
};
