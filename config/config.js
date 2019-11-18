module.exports = {
  qiniu: {
    ak: "***",
    sk: "***"
  },
  mongo: {
    host: "127.0.0.1",
    port: "27017",
    user: "name-tinder",
    password: "vb.y9:BE25TMapH",
    authSource: "name-tinder",
    database: "name-tinder"
  },
  sessionSecret: "vb.y9:BE25TMapH",
  port: 8793,
  AppID: "wx329dbba64fc7a54a",
  AppSecret: "c41def05603c9d0eb1685d4826a39a4b",
  keys: ["tinder", "name"]
};

// mongo 148.70.182.55:27017/name-tinder -u name-tinder -p vb.y9:BE25TMapH

// db.runCommand(
//   {
//     updateUser: "name-tinder",
//     roles: [{ role: "root", db: "admin" }]
//   }
// )
