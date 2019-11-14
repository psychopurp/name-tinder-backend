/* eslint-disable*/
// #!/usr/bin/env node

/**
 * Module dependencies.
 */

const http = require("http");
const mongoose = require("mongoose");
const debug = require("debug")("backend:server");
const { mongodb } = require("../utils");
const { port } = require("../config/config");
const app = require("../app");
//我加的
const { mongo } = require("../config/config");
// var DB_URL = `mongodb://${mongo.user}:${encodeURIComponent(mongo.password)}@${
//   mongo.host
// }:${mongo.port}/${mongo.database}?authSource=${mongo.authSource}`;

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? addr : addr.port;
  debug(`Listening on http://localhost:${bind}`);
}
/**
 * 处理错误
 */
function debugEr(er) {
  debug(`find an error : ${er}`);
}
/**
 * Listen on provided port, on all network interfaces.
 */

var DB_URL = "mongodb://127.0.0.1:27017/name-tinder";
mongoose.Promise = global.Promise;
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("已启动...");
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
    debug("server process starting");
  })
  .catch(debugEr);
